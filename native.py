import re, os, glob, math, wave, struct
from PIL import Image, ImageDraw
R = 'android/app/src/main/res/'

# ---- black splash + launcher background ----
for f in glob.glob(R + '**/splash.png', recursive=True): os.remove(f)
open(R + 'drawable/splash.xml', 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<shape xmlns:android="http://schemas.android.com/apk/res/android"><solid android:color="#FAF0CA"/></shape>\n')
open(R + 'values/ic_launcher_background.xml', 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0D3B66</color>\n</resources>\n')

# ---- reminder ring sound (res/raw/reminder.wav), used by the notification channel ----
os.makedirs(R + 'raw', exist_ok=True)
def make_chime(path):
    sr = 22050; total = 3.2; n = int(sr * total); buf = [0.0] * n
    notes = [(659.25, 0.0), (783.99, 0.22), (1046.5, 0.44), (1318.5, 0.95), (1046.5, 1.55), (1318.5, 1.8), (1568.0, 2.05)]
    for f, t0 in notes:
        s0 = int(t0 * sr)
        for i in range(int(1.3 * sr)):
            if s0 + i >= n: break
            t = i / sr
            env = math.exp(-3.4 * t) * min(1.0, t / 0.006)
            v = math.sin(2*math.pi*f*t) + 0.35*math.sin(2*math.pi*f*2*t) + 0.12*math.sin(2*math.pi*f*3*t)
            buf[s0 + i] += v * env * 0.26
    w = wave.open(path, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(b''.join(struct.pack('<h', int(max(-1.0, min(1.0, x)) * 32000)) for x in buf)); w.close()
make_chime(R + 'raw/reminder.wav')

# ---- theme: black status & navigation bars ----
p = R + 'values/styles.xml'; s = open(p).read()
s = s.replace('<item name="android:background">@null</item>', '<item name="android:background">@null</item>\n        <item name="android:statusBarColor">#FAF0CA</item>\n        <item name="android:navigationBarColor">#FAF0CA</item>\n        <item name="android:windowBackground">#FAF0CA</item>')
open(p, 'w').write(s)

# ---- manifest permissions ----
p = 'android/app/src/main/AndroidManifest.xml'; s = open(p).read()
s = s.replace('<uses-permission android:name="android.permission.INTERNET" />', '''<uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" android:maxSdkVersion="32" />''')
open(p, 'w').write(s)

# ---- launcher icons from the PWA icon ----
src = Image.open('www/icons/icon-512.png').convert('RGB')
fg = Image.open('www/icons/maskable-512.png').convert('RGB')
for d, legacy, adaptive in [('mdpi',48,108),('hdpi',72,162),('xhdpi',96,216),('xxhdpi',144,324),('xxxhdpi',192,432)]:
    a = src.resize((legacy, legacy), Image.LANCZOS)
    a.save(f'{R}mipmap-{d}/ic_launcher.png')
    m = Image.new('L', (legacy, legacy), 0); ImageDraw.Draw(m).ellipse([0,0,legacy-1,legacy-1], fill=255)
    r = a.copy(); r.putalpha(m); r.save(f'{R}mipmap-{d}/ic_launcher_round.png')
    fg.resize((adaptive, adaptive), Image.LANCZOS).save(f'{R}mipmap-{d}/ic_launcher_foreground.png')

# ---- native plugin: status/navigation bar colours + home screen widget data ----
JAVA_DIR = os.path.dirname(glob.glob('android/app/src/main/java/**/MainActivity.java', recursive=True)[0])
PKG = JAVA_DIR.split('android/app/src/main/java/')[1].replace('/', '.')

NAVBAR_JAVA = '''package PKG_NAME;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.Window;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Iterator;

@CapacitorPlugin(name = "NavBar")
public class NavBarPlugin extends Plugin {
    @PluginMethod
    public void set(final PluginCall call) {
        final String hex = call.getString("color", "#FAF0CA");
        final Boolean lb = call.getBoolean("light", false);
        final boolean light = lb != null && lb.booleanValue();
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    Window w = getActivity().getWindow();
                    int c = Color.parseColor(hex);
                    w.setStatusBarColor(c);
                    w.setNavigationBarColor(c);
                    w.setBackgroundDrawable(new ColorDrawable(c));
                    WindowInsetsControllerCompat ctl = WindowCompat.getInsetsController(w, w.getDecorView());
                    ctl.setAppearanceLightStatusBars(light);
                    ctl.setAppearanceLightNavigationBars(light);
                    call.resolve();
                } catch (Exception e) {
                    call.reject(String.valueOf(e.getMessage()));
                }
            }
        });
    }

    @PluginMethod
    public void widget(PluginCall call) {
        try {
            JSObject days = call.getObject("days");
            SharedPreferences.Editor ed = getContext().getSharedPreferences("lm_widget", Context.MODE_PRIVATE).edit();
            ed.clear();
            if (days != null) {
                Iterator<String> it = days.keys();
                while (it.hasNext()) {
                    String k = it.next();
                    ed.putString("d_" + k, days.getString(k));
                }
            }
            ed.putString("empty", call.getString("empty", "No meals planned"));
            ed.putString("label", call.getString("label", "Today"));
            ed.apply();
            LunchWidget.refreshAll(getContext());
            call.resolve();
        } catch (Exception e) {
            call.reject(String.valueOf(e.getMessage()));
        }
    }
}
'''
open(JAVA_DIR + '/NavBarPlugin.java', 'w').write(NAVBAR_JAVA.replace('PKG_NAME', PKG))

WIDGET_JAVA = '''package PKG_NAME;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import java.util.Calendar;
import java.util.Locale;

public class LunchWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) {
            render(context, manager, id);
        }
    }

    public static void refreshAll(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, LunchWidget.class));
        for (int id : ids) {
            render(context, manager, id);
        }
    }

    static void render(Context context, AppWidgetManager manager, int id) {
        SharedPreferences p = context.getSharedPreferences("lm_widget", Context.MODE_PRIVATE);
        Calendar c = Calendar.getInstance();
        String key = String.format(Locale.US, "%04d-%02d-%02d", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1, c.get(Calendar.DAY_OF_MONTH));
        String body = p.getString("d_" + key, null);
        if (body == null || body.length() == 0) {
            body = p.getString("empty", "No meals planned");
        }
        String label = p.getString("label", "Today");
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.lunch_widget);
        views.setTextViewText(R.id.widget_title, "LunchMate \\u00b7 " + label);
        views.setTextViewText(R.id.widget_body, body);
        Intent launch = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (launch != null) {
            PendingIntent pi = PendingIntent.getActivity(context, 0, launch, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_root, pi);
        }
        manager.updateAppWidget(id, views);
    }
}
'''
open(JAVA_DIR + '/LunchWidget.java', 'w').write(WIDGET_JAVA.replace('PKG_NAME', PKG))

open(JAVA_DIR + '/MainActivity.java', 'w').write('''package PKG_NAME;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NavBarPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
'''.replace('PKG_NAME', PKG))

# ---- widget resources ----
for d in ('layout', 'drawable', 'xml'):
    os.makedirs(R + d, exist_ok=True)
open(R + 'drawable/widget_bg.xml', 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle"><solid android:color="#FAF0CA"/><corners android:radius="22dp"/></shape>\n')
open(R + 'layout/lunch_widget.xml', 'w').write('''<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="14dp"
    android:background="@drawable/widget_bg">
    <TextView
        android:id="@+id/widget_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textColor="#0D3B66"
        android:textSize="14sp"
        android:textStyle="bold"
        android:maxLines="1" />
    <TextView
        android:id="@+id/widget_body"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="6dp"
        android:textColor="#0D3B66"
        android:textSize="13sp"
        android:maxLines="7"
        android:ellipsize="end" />
</LinearLayout>
''')
open(R + 'xml/lunch_widget_info.xml', 'w').write('''<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="110dp"
    android:updatePeriodMillis="1800000"
    android:initialLayout="@layout/lunch_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
''')
p = 'android/app/src/main/AndroidManifest.xml'; s = open(p).read()
if 'LunchWidget' not in s:
    s = s.replace('</application>', '''    <receiver android:name=".LunchWidget" android:exported="false">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/lunch_widget_info" />
        </receiver>
    </application>''')
    open(p, 'w').write(s)
