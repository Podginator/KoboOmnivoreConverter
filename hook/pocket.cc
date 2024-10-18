#include <QApplication>
#include <QDebug>
#include <QFileInfo>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QString>
#include <QUrl>

#include <cstdlib>

#include <dlfcn.h>
#include <syslog.h>
#include <unistd.h>
#include <iostream>

#include <NickelHook.h>

typedef void WebResponseInflater;
typedef void WebRequester; 
typedef void PocketSettings;
static void (*makeQRequest_orig)(QUrl const&, QString const&, QMap<QString, QString> const&, QByteArray*, WebResponseInflater*, int, int, QNetworkRequest::CacheLoadControl);

static struct nh_info PocketInterceptor = (struct nh_info){
    .name           = "PocketInterceptor",
    .desc           = "Intercepts Pocket Calls and redirects them to Omnivore",
    .uninstall_flag = nullptr,
};

static int pocket_init()
{
    return 0;
}

// This simply intercepts the Network call, detects whether or not it is calling out to Pocket, and if it is replaces the URL to the Proxy Server. 
// This means that you can replace the replacementUrls with actual servers hosted on, say, Lambda or Vercel and it would work fine. 
// For now I am keeping it as the hosts file. 
extern "C" __attribute__((visibility("default"))) void _intercept_network(QUrl url, QString param, QMap<QString, QString> headers, QByteArray *output, WebResponseInflater* inflater, int param1, int param2, QNetworkRequest::CacheLoadControl cl) {
    QString urlStr = url.toString(QUrl::None);
    QByteArray urlArray = urlStr.toUtf8();
    char* urlChar = urlArray.data();

    QUrl replacementUrl = url;
    // Do a basic string compare. 
    if (strcmp(urlChar, "https://getpocket.com/v3/get") == 0) 
    { 
        nh_log("Redirecting Pocket Call to Omnivore Converter");
        replacementUrl = QUrl("http://fckkpocket.com/v3/get");
    } 
    else if (strcmp(urlChar, "https://getpocket.com/v3/send") == 0) 
    {
        nh_log("Redirecting Pocket Call to Omnivore Converter");
        replacementUrl = QUrl("http://fckkpocket.com/v3/send");
    }
    else if (strcmp(urlChar, "https://text.getpocket.com/v3beta/text") == 0)
    {
        nh_log("Redirecting Pocket Call to Omnivore Converter");
        replacementUrl = QUrl("http://text.fckpocket.com/v3beta/text?access_token=<your-access-token>");
    }
    
    makeQRequest_orig(replacementUrl, param, headers, output, inflater, param1, param2, cl);
}


static struct nh_hook PocketIntereceptorHook[] = {
    {.sym = "_ZN12WebRequester11makeRequestERK4QUrlRK7QStringRK4QMapIS3_S3_ERK10QByteArrayP19WebResponseInflateriiN15QNetworkRequest16CacheLoadControlE", .sym_new = "_intercept_network", .lib = "libnickel.so.1.0.0", .out = nh_symoutptr(makeQRequest_orig), .desc = "calls to metadata", .optional=true},
    {0},
};

NickelHook(
    .init  = &pocket_init,
    .info  = &PocketInterceptor,
    .hook  = PocketIntereceptorHook,
    .dlsym = nullptr
);