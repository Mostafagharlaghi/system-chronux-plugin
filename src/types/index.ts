import { UiTablixCellContext, MetricLegendItem } from "@dolphin/ui";
import { ColumnsType } from "../components/PermissionsTable/types";

export type ExtendedContext<K extends keyof ColumnsType> = UiTablixCellContext<ColumnsType, K> & {
    searchValue?: string;
    globalQuery?: string;
};


export interface TaskProps {
  title?: string;
  totalValue?: number | string;
  subtitle?: string;
  accentColor?: string;
  primaryMetric?: MetricItem;
  secondaryMetric?: MetricItem;
  legendItems?: MetricLegendItem[];
  isLoading?: boolean;
}

export interface MetricItem {
  label: string;
  value: number;
  color?: string;
}