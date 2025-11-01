## Uploading files

To copy the content of the `public` directory to the ESP32, run the following command:

```
mpremote cp -r public :/
```

This will only copy files that need updating.

## Counting free memory

To figure out how much space is left on the device we can run

```
mpremote exec "import os; s=os.statvfs('/'); print(s[0]*s[3])"
```

This returns the number of _bytes_. 933888 free bytes would e.g. correspond to 0.93 MB.

## Deleting files

To list the directory content of the `public` directory on the ESP32:

```
mpremote ls :/public
```

To remote unwanted or unneeded files (e.g. .DS_Store):

```
mpremote rm :/public/.DS_Store
```
