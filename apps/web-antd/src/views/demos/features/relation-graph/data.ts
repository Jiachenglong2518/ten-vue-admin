import { industrialChainGraph } from './industrial-chain';

export type RelationGraphPresetKey =
  | 'industrialChain'
  | 'organization'
  | 'service';

export type RelationGraphNodeKind = 'category' | 'leaf' | 'root' | 'section';

export type RelationGraphAccent = 'blue' | 'cyan';

export interface RelationGraphNodeData {
  category: string;
  summary: string;
  kind?: RelationGraphNodeKind;
  accent?: RelationGraphAccent;
  code?: string;
}

export interface RelationGraphNode {
  id: string;
  text: string;
  width?: number;
  height?: number;
  color?: string;
  borderColor?: string;
  fontColor?: string;
  expanded?: boolean;
  children?: RelationGraphNode[];
  data?: RelationGraphNodeData;
}

export interface RelationGraphLine {
  from: string;
  to: string;
  text?: string;
  color?: string;
}

export interface RelationGraphJsonData {
  rootId: string;
  nodes: RelationGraphNode[];
  lines: RelationGraphLine[];
}

export interface RelationGraphPreset {
  key: RelationGraphPresetKey;
  title: string;
  description: string;
  tagColor: string;
  data: RelationGraphJsonData;
}

function createRootNode(
  id: string,
  text: string,
  summary: string,
): RelationGraphNode {
  return {
    id,
    text,
    color: '#1677ff',
    borderColor: '#0958d9',
    fontColor: '#ffffff',
    width: 150,
    height: 72,
    data: {
      category: '核心节点',
      summary,
    },
  };
}

function createNode(
  id: string,
  text: string,
  category: string,
  summary: string,
  extra: Partial<RelationGraphNode> = {},
): RelationGraphNode {
  return {
    id,
    text,
    color: '#f8fbff',
    borderColor: '#91caff',
    fontColor: '#1f1f1f',
    width: 112,
    height: 58,
    data: {
      category,
      summary,
    },
    ...extra,
  };
}

function createLine(
  from: string,
  to: string,
  text: string,
  color = '#69b1ff',
): RelationGraphLine {
  return {
    from,
    to,
    text,
    color,
  };
}

export function countGraphNodes(nodes: RelationGraphNode[]): number {
  return nodes.reduce((total, node) => {
    return total + 1 + countGraphNodes(node.children ?? []);
  }, 0);
}

export function countGraphConnections(data: RelationGraphJsonData): number {
  if (data.lines.length > 0) {
    return data.lines.length;
  }

  const countChildren = (nodes: RelationGraphNode[]): number => {
    return nodes.reduce((total, node) => {
      return (
        total +
        (node.children?.length ?? 0) +
        countChildren(node.children ?? [])
      );
    }, 0);
  };

  return countChildren(data.nodes);
}

const organizationGraph: RelationGraphJsonData = {
  rootId: 'platform',
  nodes: [
    createRootNode(
      'platform',
      '平台中台',
      '统一承载公共能力、权限和布局规范。',
    ),
    createNode(
      'product',
      '产品协同',
      '协作层',
      '负责需求拆解、路线规划和跨团队协调。',
      {
        color: '#fff7e6',
        borderColor: '#ffd591',
      },
    ),
    createNode(
      'research',
      '研发中心',
      '执行层',
      '负责功能交付、技术方案和代码实现。',
      {
        color: '#e6f4ff',
        borderColor: '#91caff',
      },
    ),
    createNode(
      'design',
      '设计中心',
      '体验层',
      '负责视觉规范、交互稿和体验优化。',
      {
        color: '#f9f0ff',
        borderColor: '#d3adf7',
      },
    ),
    createNode(
      'ops',
      '运营支持',
      '运营层',
      '负责活动配置、内容发布和用户运营。',
      {
        color: '#f6ffed',
        borderColor: '#b7eb8f',
      },
    ),
    createNode('frontend', '前端组', '研发子组', '负责页面、组件和交互实现。'),
    createNode('backend', '后端组', '研发子组', '负责接口、数据和服务稳定性。'),
    createNode(
      'qa',
      '测试组',
      '研发子组',
      '负责用例设计、回归验证和质量保障。',
    ),
    createNode('data', '数据组', '研发子组', '负责埋点、指标和分析看板。'),
  ],
  lines: [
    createLine('platform', 'product', '协作'),
    createLine('platform', 'research', '协作'),
    createLine('platform', 'design', '协作'),
    createLine('platform', 'ops', '协作'),
    createLine('research', 'frontend', '交付'),
    createLine('research', 'backend', '交付'),
    createLine('research', 'qa', '验证'),
    createLine('research', 'data', '分析'),
  ],
};

const serviceGraph: RelationGraphJsonData = {
  rootId: 'graph-demo',
  nodes: [
    createRootNode(
      'graph-demo',
      '关系数据 Demo',
      '展示系统模块之间的依赖与联动关系。',
    ),
    createNode(
      'auth',
      '权限中心',
      '基础服务',
      '统一管理角色、菜单和数据权限。',
      {
        color: '#f6ffed',
        borderColor: '#95de64',
      },
    ),
    createNode('menu', '菜单中心', '基础服务', '负责路由树、菜单和页面入口。', {
      color: '#e6f4ff',
      borderColor: '#91caff',
    }),
    createNode('flow', '流程引擎', '业务能力', '承载审批流和状态流转。', {
      color: '#f9f0ff',
      borderColor: '#d3adf7',
    }),
    createNode(
      'message',
      '消息中心',
      '业务能力',
      '负责通知、站内信和消息触达。',
      {
        color: '#fffbe6',
        borderColor: '#ffd666',
      },
    ),
    createNode('audit', '审计中心', '合规能力', '记录关键行为和异常事件。', {
      color: '#fff1f0',
      borderColor: '#ffa39e',
    }),
    createNode('stat', '统计报表', '数据能力', '聚合核心指标和趋势分析。', {
      color: '#e6fffb',
      borderColor: '#87e8de',
    }),
    createNode('file', '文件服务', '平台能力', '负责附件存储、预览和下载。', {
      color: '#fff7e6',
      borderColor: '#ffd591',
    }),
    createNode('api', '接口网关', '平台能力', '统一接入、鉴权和限流控制。', {
      color: '#f5f5f5',
      borderColor: '#d9d9d9',
    }),
  ],
  lines: [
    createLine('graph-demo', 'auth', '约束'),
    createLine('graph-demo', 'menu', '入口'),
    createLine('graph-demo', 'flow', '驱动'),
    createLine('graph-demo', 'message', '触达'),
    createLine('graph-demo', 'audit', '记录'),
    createLine('graph-demo', 'stat', '汇总'),
    createLine('graph-demo', 'file', '承载'),
    createLine('graph-demo', 'api', '接入'),
    createLine('menu', 'auth', '依赖', '#73d13d'),
    createLine('flow', 'message', '联动', '#9254de'),
    createLine('api', 'audit', '追踪', '#ff7875'),
    createLine('stat', 'message', '分析', '#13c2c2'),
    createLine('file', 'audit', '留痕', '#faad14'),
  ],
};

export const relationGraphPresets: [
  RelationGraphPreset,
  RelationGraphPreset,
  RelationGraphPreset,
] = [
  {
    key: 'industrialChain',
    title: '新能源产业链',
    description: '按截图中的结构还原新能源产业链树状关系图。',
    tagColor: 'cyan',
    data: industrialChainGraph,
  },
  {
    key: 'organization',
    title: '组织结构图',
    description: '用于展示团队分工和上下游协作边界。',
    tagColor: 'blue',
    data: organizationGraph,
  },
  {
    key: 'service',
    title: '业务关系图',
    description: '用于展示模块依赖、数据流转和系统联动。',
    tagColor: 'purple',
    data: serviceGraph,
  },
];
