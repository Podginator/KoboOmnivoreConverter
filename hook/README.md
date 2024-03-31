# PocketInterceptor

Uses [NickelHook](https://github.com/pgaskin/NickelHook) to intercept the call to Pocket, and replace it with the call to this Proxy service. 

## Compile

In order to find out more about the NickelHook, please visit the above url. 

To compile and create the hook run 
`docker run --volume="$PWD:$PWD" --workdir="$PWD" --env=HOME --entrypoint="make" --rm -it ghcr.io/pgaskin/nickeltc:1.0` 

To put this on your kobo run the following commands
 
`mkdir -p usr/local/Kobo/imageformats/ && mv libpocket.so usr/local/Kobo/imageformats/ && tar czf KoboRoot.tgz usr/local/Kobo/imageformats/libpocket.so` 

Place the resulting KoboRoot.tgz file in the .kobo directory of your Kobo Device, and reboot. 


## Hosted

This update allows you to effectively run hosted versions of this converter. 


In order to do this open `pocket.cc` and replace the following 

```c
if (strcmp(urlChar, "https://getpocket.com/v3/get") == 0) 
{ 
    replacementUrl = QUrl("http://fckkpocket.com/v3/get");
} 
else if (strcmp(urlChar, "https://text.getpocket.com/v3beta/text") == 0)
{
    replacementUrl = QUrl("http://text.fckpocket.com/v3beta/text");
}
    
```

with 

```c 
if (strcmp(urlChar, "https://getpocket.com/v3/get") == 0) 
{ 
    replacementUrl = QUrl("<HOSTED_VERSION_URL>/v3/get");
} 
else if (strcmp(urlChar, "https://text.getpocket.com/v3beta/text") == 0)
{
    replacementUrl = QUrl("<HOSTED_VERSION_URL>/v3beta/text");
}
```

This can also use https, meaning a hosted version is now viable. 