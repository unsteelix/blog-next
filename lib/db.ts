import { readFileSync, writeFileSync } from "node:fs";
import path from "path";
import type { IPosts } from "../types";
import proxyfull from "proxyfull";

const defaultDB: { posts: IPosts } = {
  posts: {
    bshssrtbs: {
      id: "bshssrtbs",
      slug: "page_2",
      preview: "975576d361_w1966_h2560",
      cover: "975576d361_w1966_h2560",
      title: "title",
      subTitle: "subTitle",
      index: 0,
      show: true,
      blocks: {},
    },
    oiuytj: {
      id: "oiuytj",
      slug: "page_1",
      preview: "975576d361_w1966_h2560",
      cover: "975576d361_w1966_h2560",
      title: "title",
      subTitle: "subTitle",
      index: 1,
      show: true,
      blocks: {},
    },
  },
};

const filePath = path.join(path.dirname("./volume/db.json"), "db.json");

class DB {
  filePath;
  target = {};

  constructor(filePath: string) {
    this.filePath = filePath;
    this.target = this.readDB(filePath);
    return this.makeProxy(this.target);
  }

  initDB(filePath: string) {
    try {
      writeFileSync(filePath, JSON.stringify(defaultDB));
      console.log("Default database was successfully initialized");
    } catch (e) {
      console.log("[Error] error in initializating default database:", e);
    }
  }

  // reading DB file
  readDB(filePath: string): any {
    try {
      const file = readFileSync(filePath, "utf8");
      return JSON.parse(file);
    } catch (e) {
      console.log("[Error] reading database file error:", e);
      this.initDB(filePath);
      return this.readDB(filePath);
    }
  }

  // writing to DB file
  writeDB(filePath: string, data: string): any {
    try {
      writeFileSync(filePath, data, "utf8");
    } catch (e) {
      console.log("[Error] writing to database file error:", e);
    }
  }

  makeProxy(target: any) {
    const validator = {
      set: (
        target: any,
        property: any,
        newValue: any,
        receiver: any,
        path: string
      ) => {
        try {
          // console.log(
          //   `You are setting '${
          //     typeof newValue === "string" ? newValue : JSON.stringify(newValue)
          //   }' to '${String(property)}' property`
          // );

          // parse path and set value
          let t: any = this.target;
          path.split(".").forEach((p: any) => {
            t = t[p];
          });
          t = newValue;

          // checking what new value is successfully settled
          if (t === newValue) {
            // write to file
            this.writeDB(filePath, JSON.stringify(this.target));
            return true;
          }
          return false;
        } catch (e) {
          console.log("[Error] setting data error");
          return false;
        }
      },
      get: (target: any, property: any) => {
        try {
          //console.log(`You are getting '${String(property)}' property`);

          // if (
          //   typeof target[property] === "object" &&
          //   target[property] !== null
          // ) {
          //   return new proxyfull(target[property], validator);
          // }
          return target[property];
        } catch (e) {
          console.log("[Error] getting data error");
        }
      },
    };

    let proxy = new proxyfull(target, validator);
    return proxy;
  }
}

// Использование:
let db: any = new DB(filePath);

// // init default DB
// const initDB = (filepath: string) => {
//   try {
//     writeFileSync(filePath, JSON.stringify(defaultDB));
//     console.log("Default database was successfully initialized");
//   } catch (e) {
//     console.log("[Error] error in initializating default database:", e);
//   }
// };

// // reading DB file
// const readDB = (filepath: string): any => {
//   try {
//     const file = readFileSync(filePath, "utf8");
//     return JSON.parse(file);
//   } catch (e) {
//     console.log("[Error] reading database file error:", e);
//     initDB(filePath);
//     return readDB(filePath);
//   }
// };

// // writing to DB file
// const writeDB = (filepath: string, data: string): any => {
//   try {
//     writeFileSync(filePath, data, "utf8");
//   } catch (e) {
//     console.log("[Error] writing to database file error:", e);
//   }
// };

// let target = readDB(filePath);

// let proxy = new Proxy(target, {
//   set: (target, property, newValue, itemProxy) => {
//     console.log("\n\n -------  proxy----------- \n\n");
//     //return true;
//     try {
//       console.log(
//         `You are setting '${
//           typeof newValue === "string" ? newValue : JSON.stringify(newValue)
//         }' to '${String(property)}' property`
//       );
//       target[property] = newValue;

//       // checking what new value is successfully settled
//       console.log("\n\n --------  11111  ---------\n\n");

//       if (target[property] === newValue) {
//         // write to file
//         console.log("\n\n --------  22222  ---------\n\n");

//         writeDB(filePath, JSON.stringify(target));
//         console.log("\n\n --------  33333  ---------\n\n");

//         return true;
//       }
//       return false;
//     } catch (e) {
//       console.log("[Error] setting data error");
//       return false;
//     }
//   },
//   get: (target, property) => {
//     try {
//       console.log(`You are getting '${String(property)}' property`);
//       return target[property];
//     } catch (e) {
//       console.log("[Error] getting data error");
//     }
//   },
// });

export default db;
