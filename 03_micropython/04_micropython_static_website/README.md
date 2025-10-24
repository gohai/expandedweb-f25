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

This returns the number of _bytes_. 1650688 free bytes would e.g. correspond to 1.65 MB.
