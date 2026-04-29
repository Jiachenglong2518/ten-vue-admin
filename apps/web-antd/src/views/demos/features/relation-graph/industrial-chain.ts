import type {
  RelationGraphAccent,
  RelationGraphJsonData,
  RelationGraphNode,
  RelationGraphNodeKind,
} from './data';

type LeafSpec = readonly [id: string, text: string, summary: string];

interface ChainNodeConfig {
  id: string;
  text: string;
  kind: RelationGraphNodeKind;
  accent: RelationGraphAccent;
  category: string;
  summary: string;
  code?: string;
  expanded?: boolean;
  children?: RelationGraphNode[];
}

const chainTheme: Record<
  RelationGraphAccent,
  Record<
    RelationGraphNodeKind,
    {
      borderColor: string;
      color: string;
      fontColor: string;
      height: number;
      width: number;
    }
  >
> = {
  cyan: {
    root: {
      borderColor: '#52d6de',
      color: '#7fe8ef',
      fontColor: '#ffffff',
      height: 44,
      width: 180,
    },
    section: {
      borderColor: '#80dde3',
      color: '#9fe8ee',
      fontColor: '#0f5660',
      height: 36,
      width: 72,
    },
    category: {
      borderColor: '#a4e7ea',
      color: '#c9f5f7',
      fontColor: '#13555f',
      height: 36,
      width: 126,
    },
    leaf: {
      borderColor: '#bfebee',
      color: '#dcfafb',
      fontColor: '#13555f',
      height: 34,
      width: 186,
    },
  },
  blue: {
    root: {
      borderColor: '#4678e8',
      color: '#7ca1f8',
      fontColor: '#ffffff',
      height: 44,
      width: 180,
    },
    section: {
      borderColor: '#9fbbfb',
      color: '#b7cafb',
      fontColor: '#1c3f94',
      height: 36,
      width: 72,
    },
    category: {
      borderColor: '#abc0fd',
      color: '#d2ddfe',
      fontColor: '#1c3f94',
      height: 36,
      width: 126,
    },
    leaf: {
      borderColor: '#c4d2fe',
      color: '#e6ecff',
      fontColor: '#1c3f94',
      height: 34,
      width: 186,
    },
  },
};

function createChainNode(config: ChainNodeConfig): RelationGraphNode {
  const theme = chainTheme[config.accent][config.kind];

  return {
    id: config.id,
    text: config.text,
    width: theme.width,
    height: theme.height,
    color: theme.color,
    borderColor: theme.borderColor,
    fontColor: theme.fontColor,
    expanded: config.expanded ?? true,
    children: config.children,
    data: {
      accent: config.accent,
      category: config.category,
      code: config.code,
      kind: config.kind,
      summary: config.summary,
    },
  };
}

function buildLeaves(
  category: string,
  accent: RelationGraphAccent,
  items: readonly LeafSpec[],
): RelationGraphNode[] {
  return items.map(([id, text, summary]) =>
    createChainNode({
      accent,
      category,
      id,
      kind: 'leaf',
      summary,
      text,
    }),
  );
}

const upstreamMineralLeaves = buildLeaves('矿产资源', 'cyan', [
  ['0610', '0610 采掘辅助活动', '采矿前期勘探与辅助作业。'],
  ['0711', '0711 煤炭开采和洗选业', '煤炭开采与洗选加工。'],
  ['0810', '0810 铁矿采选', '铁矿资源开采和选矿。'],
  ['0913', '0913 铜矿采选', '铜矿资源开采和选矿。'],
  ['0918', '0918 铅锌矿采选', '铅锌矿资源开采和选矿。'],
  ['0832', '0832 黑色金属矿采选', '黑色金属矿的采选加工。'],
  ['1011', '1011 石灰石、石膏开采', '石灰石与石膏等基础矿石开采。'],
  ['1022', '1022 石墨、滑石采选', '石墨、滑石等非金属矿采选。'],
]);

const upstreamMaterialLeaves = buildLeaves('基础材料', 'cyan', [
  ['3251', '3251 有色金属压延加工', '有色金属板材、带材与箔材加工。'],
  ['2611', '2611 无机盐制造', '无机盐、无机化工原料制造。'],
  ['2613', '2613 无机碱制造', '无机碱及相关化工品制造。'],
  ['2651', '2651 初级形态塑料及合成树脂制造', '塑料基材与合成树脂生产。'],
  ['2821', '2821 橡胶制品制造', '橡胶制品与弹性材料制造。'],
  ['3042', '3042 特种陶瓷制品制造', '特种陶瓷与结构陶瓷制品制造。'],
  ['3110', '3110 炼钢', '钢铁冶炼与钢材基础生产。'],
  ['3216', '3216 锂离子电池制造', '锂电池正负极、隔膜与电芯制造。'],
]);

const corePartsLeaves = buildLeaves('核心零部件', 'cyan', [
  ['motor', '驱动电机', '驱动电机与动力输出装置。'],
  ['bms', '电池管理系统', 'BMS、电芯管理与安全监控。'],
  ['power-semiconductor', '功率半导体', 'IGBT、SiC 等功率器件。'],
]);

const vehicleLeaves = buildLeaves('整车制造', 'cyan', [
  ['passenger-ev', '纯电乘用车', '纯电动乘用车整车制造。'],
  ['hybrid-ev', '插混乘用车', '插电式混合动力乘用车制造。'],
  ['commercial-vehicle', '商用整车', '公交、物流与专用商用车制造。'],
]);

const electronicsLeaves = buildLeaves('电子装配', 'cyan', [
  ['vehicle-chip', '车规芯片', '车规级芯片与控制芯片。'],
  ['cockpit', '智能座舱', '座舱、屏幕与人机交互组件。'],
  ['sensor', '传感器组件', '感知类传感器与采集组件。'],
]);

const stationLeaves = buildLeaves('电站建设', 'cyan', [
  ['epc', 'EPC总包', '工程设计、采购与施工总包。'],
  ['site-construction', '场站施工', '场站施工与设备安装。'],
]);

const operationLeaves = buildLeaves('电力运营', 'cyan', [
  ['grid-access', '电网接入', '并网接入与电力调度。'],
  ['smart-dispatch', '智能调度', '智能调度与负荷优化。'],
]);

const maintenanceLeaves = buildLeaves('运维环保', 'cyan', [
  ['device-maintenance', '设备维保', '设备巡检、维修与保养。'],
  ['green-operation', '绿色运维', '节能降耗与绿色运维。'],
]);

const energyManagementLeaves = buildLeaves('能源管理', 'blue', [
  ['ems', 'EMS平台', '能源管理系统与调度平台。'],
  ['smart-park', '智慧园区', '智慧园区与能耗优化。'],
]);

const recyclingLeaves = buildLeaves('回收维修', 'blue', [
  ['battery-recycling', '电池回收', '动力电池回收与拆解。'],
  ['ladder-utilization', '梯次利用', '电池梯次利用与再制造。'],
]);

const chargingLeaves = buildLeaves('充换电服务', 'blue', [
  ['public-charging', '公共充电', '公共充电桩与补能网络。'],
  ['battery-swap', '换电服务', '换电站与换电运营服务。'],
]);

export const industrialChainGraph: RelationGraphJsonData = {
  rootId: 'new-energy-chain',
  nodes: [
    createChainNode({
      id: 'new-energy-chain',
      text: '新能源产业链',
      kind: 'root',
      accent: 'cyan',
      category: '产业链总览',
      summary: '按上游、中游、下游、消费四层展示新能源相关环节。',
      children: [
        createChainNode({
          id: 'upstream',
          text: '上游',
          kind: 'section',
          accent: 'cyan',
          category: '一级环节',
          summary: '资源供给与基础材料',
          expanded: true,
          children: [
            createChainNode({
              id: 'upstream-mineral',
              text: '矿产资源',
              kind: 'category',
              accent: 'cyan',
              category: '上游资源',
              summary: '新能源相关矿产采选与供给',
              expanded: true,
              children: upstreamMineralLeaves,
            }),
            createChainNode({
              id: 'upstream-materials',
              text: '基础材料',
              kind: 'category',
              accent: 'cyan',
              category: '上游材料',
              summary: '金属、化工与电池基础材料',
              expanded: true,
              children: upstreamMaterialLeaves,
            }),
          ],
        }),
        createChainNode({
          id: 'midstream',
          text: '中游',
          kind: 'section',
          accent: 'cyan',
          category: '一级环节',
          summary: '核心零部件与整机制造',
          expanded: true,
          children: [
            createChainNode({
              id: 'core-parts',
              text: '核心零部件',
              kind: 'category',
              accent: 'cyan',
              category: '中游制造',
              summary: '动力系统与关键器件',
              expanded: false,
              children: corePartsLeaves,
            }),
            createChainNode({
              id: 'vehicle-manufacturing',
              text: '整车制造',
              kind: 'category',
              accent: 'cyan',
              category: '中游制造',
              summary: '整车平台与系统集成',
              expanded: false,
              children: vehicleLeaves,
            }),
            createChainNode({
              id: 'electronics',
              text: '电子装配',
              kind: 'category',
              accent: 'cyan',
              category: '中游制造',
              summary: '车规电子与控制器装配',
              expanded: false,
              children: electronicsLeaves,
            }),
          ],
        }),
        createChainNode({
          id: 'downstream',
          text: '下游',
          kind: 'section',
          accent: 'cyan',
          category: '一级环节',
          summary: '场站建设、运营与运维服务',
          expanded: true,
          children: [
            createChainNode({
              id: 'power-station',
              text: '电站建设',
              kind: 'category',
              accent: 'cyan',
              category: '下游应用',
              summary: '发电站、储能站与配套设施建设',
              expanded: false,
              children: stationLeaves,
            }),
            createChainNode({
              id: 'power-operation',
              text: '电力运营',
              kind: 'category',
              accent: 'cyan',
              category: '下游应用',
              summary: '电力调度与场站运营',
              expanded: false,
              children: operationLeaves,
            }),
            createChainNode({
              id: 'ops-maintenance',
              text: '运维环保',
              kind: 'category',
              accent: 'cyan',
              category: '下游应用',
              summary: '设备运维与绿色循环',
              expanded: false,
              children: maintenanceLeaves,
            }),
          ],
        }),
        createChainNode({
          id: 'consumer',
          text: '消费',
          kind: 'section',
          accent: 'blue',
          category: '一级环节',
          summary: '终端应用、回收与充换电服务',
          expanded: true,
          children: [
            createChainNode({
              id: 'energy-management',
              text: '能源管理',
              kind: 'category',
              accent: 'blue',
              category: '终端消费',
              summary: '园区能源管理与综合调度',
              expanded: false,
              children: energyManagementLeaves,
            }),
            createChainNode({
              id: 'recycling-maintenance',
              text: '回收维修',
              kind: 'category',
              accent: 'blue',
              category: '终端消费',
              summary: '回收、检测与梯次利用',
              expanded: false,
              children: recyclingLeaves,
            }),
            createChainNode({
              id: 'charging-swapping',
              text: '充换电服务',
              kind: 'category',
              accent: 'blue',
              category: '终端消费',
              summary: '公共充电与换电服务',
              expanded: false,
              children: chargingLeaves,
            }),
          ],
        }),
      ],
    }),
  ],
  lines: [],
};
