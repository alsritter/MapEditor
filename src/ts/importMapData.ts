/**
 * @file 用于导入数据
 *
 * @author alsritter(alsritter1@gmail.com)
 */

import GridManager from "./data/gridManager";
import StartAndEndPos from "./data/VO/StartAndEndPos";
import Grid from "./data/VO/Grid";
import BasePos from "./data/VO/BasePos";
import { Store } from "vuex";

function constructData(
  sprites: BasePos[],
  layerData: number[][],
  space: number,
  cols: number,
  rows: number
): GridManager {
  const tempMap: Grid[][] = [];

  // 因为生成数据时已经抹除了多余的信息，所以这里需要重新生成
  for (let i = 0; i < layerData.length; i++) {
    const tempGrids: Grid[] = [];
    for (let j = 0; j < layerData[i].length; j++) {
      tempGrids.push(
        new Grid(
          j * space,
          i * space,
          sprites[layerData[i][j]].x,
          sprites[layerData[i][j]].y
        )
      );
    }
    tempMap.push(tempGrids);
  }

  const temp = new GridManager(space, cols, rows);
  temp.setMap(tempMap);

  return temp;
}

export function importData(
  $store: Store<any>,
  importButton: HTMLInputElement
): void {
  importButton.onchange = () => {
    // 读取文件
    // @ts-ignore：这里会非空的报错
    const file = importButton.files[0];

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      // 文件的原始数据
      const data: {
        start: {
          x: number;
          y: number;
        };
        end: {
          x: number;
          y: number;
        };
        sprites: BasePos[];
        background: number[][];
        collision: number[][];
        traps: number[][];
        foreground: number[][];
      } = JSON.parse(reader.result as string);

      const newMap: GridManager[] = [];
      const rows = data.background.length;
      const cols = data.background[0].length;

      // 通知 Vuex 更变宽高
      $store.commit("changeNewCanvasSize", {
        cols: cols,
        rows: rows
      });

      let _space = 0;

      if (cols > rows) {
        // 宽度不变，主要是高度会改变（取屏幕的五分之三）
        _space = Math.ceil((document.body.clientWidth * 3) / 5 / cols);
      } else {
        // 取屏幕的五分之四
        _space = Math.ceil((document.body.clientHeight * 4) / 5 / rows);
      }

      newMap.push(
        constructData(data.sprites, data.background, _space, cols, rows)
      );
      newMap.push(
        constructData(data.sprites, data.collision, _space, cols, rows)
      );
      newMap.push(constructData(data.sprites, data.traps, _space, cols, rows));
      newMap.push(
        constructData(data.sprites, data.foreground, _space, cols, rows)
      );

      // 更新数据
      $store.commit("setMapData", {
        newMap: newMap,
        newSA: new StartAndEndPos(
          new BasePos(data.start.x, data.start.y),
          new BasePos(data.end.x, data.end.y)
        )
      });
    };
  };
}
