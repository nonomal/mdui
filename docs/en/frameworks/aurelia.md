After completing the [installation](/en/docs/2/getting-started/installation#npm) of mdui, you'll need to install and configure an additional package (Aurelia 2 only)

```shell
npm install aurelia-mdui --save
```

and connect it to your application.
```typescript
import {MduiWebTask} from "./aurelia-mdui"

Aurelia
    .register(MduiWebTask)
    .app(MyApp)
    .start()
```

## Notes {#notes}

Please send bug reports to https://github.com/mreiche/aurelia-mdui
