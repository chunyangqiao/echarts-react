import * as React from "react";
import * as echarts from "echarts/core";
import classnames from "classnames";
import { BarChart } from "echarts/charts";
import {
  // 数据集组件
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from "echarts/components";
import type { BarSeriesOption } from "echarts/charts";
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from "echarts/components";

import type { ComposeOption } from "echarts/core";

import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  BarChart,
  CanvasRenderer,
]);

export type BarOptions = ComposeOption<
  | BarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LegendComponentOption
>;

export interface BarProps {
  style?: React.CSSProperties;
  className?: string;
  options?: BarOptions;
  onClick?: (event: echarts.ECElementEvent) => void;
}

export interface BarExposedAPI {
  getInstance: () => echarts.ECharts | null;
}

export const Bar = React.forwardRef<BarExposedAPI, BarProps>((props, ref) => {
  const { options } = props;
  const [mountedNode, setMountedNode] = React.useState<HTMLDivElement>();
  const instance = React.useRef<echarts.ECharts | null>(null);

  const getInstance = React.useCallback(() => {
    return instance.current;
  }, []);

  const resize = React.useCallback(() => {
    if (instance.current) {
      instance.current.resize({ animation: { duration: 320 } });
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  React.useEffect(() => {
    if (mountedNode) {
      const readyInstance = echarts.getInstanceByDom(mountedNode);
      if (!readyInstance && options) {
        instance.current = echarts.init(mountedNode);
        instance.current.on("click", (params) => {
          props.onClick?.(params);
        });
        instance.current.setOption(options);
      }
    }

    return () => {
      instance.current?.dispose();
    };
  }, [mountedNode, options]);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        getInstance,
      };
    },
    []
  );

  return (
    <div
      style={props.style}
      className={classnames("w-full h-full", props.className)}
      ref={(element) => {
        if (element && !mountedNode) {
          setMountedNode(element);
        }
      }}
    ></div>
  );
});
