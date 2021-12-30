CRON:
```
exports = function() {
  const domain = "https://e2c1660e4a37.ngrok.io";
  const response = context.http.post({
    url: domain + "/cron",
    body: { 
      secret: "XYZ",
      date: new Date().toISOString().slice(0, 16)
    },
    encodeBodyAsJSON: true
  });
};
```

RUN:
```
exports = function(event) {
  const domain = "https://e1837b9a4b78.ngrok.io";
  const response = context.http.post({
    url: domain + "/queue/" + event.fullDocument._action,
    body: { 
      secret: "XYZ",
      store: event.fullDocument._store,
      doc: event.fullDocument
    },
    encodeBodyAsJSON: true
  });
};
```