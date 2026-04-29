<script setup lang="ts">
import type {
  RelationGraphInstance,
  RGLine,
  RGLink,
  RGNode,
  RGOptions,
  RGUserEvent,
} from 'relation-graph/vue3';

import type {
  RelationGraphJsonData,
  RelationGraphNodeData,
  RelationGraphPresetKey,
} from './data';

import { computed, nextTick, shallowRef, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Descriptions,
  DescriptionsItem,
  Tag,
} from 'ant-design-vue';
import RelationGraph from 'relation-graph/vue3';

import { $t } from '#/locales';

import {
  countGraphConnections,
  countGraphNodes,
  relationGraphPresets,
} from './data';

interface RelationGraphRef {
  setJsonData: (data: RelationGraphJsonData) => Promise<void> | void;
  getInstance: () => RelationGraphInstance;
}

interface SelectedDetail {
  label: string;
  value: string;
}

interface SelectedItem {
  kind: 'line' | 'node';
  title: string;
  details: SelectedDetail[];
}

const graphRef = shallowRef<null | RelationGraphRef>(null);
const currentPresetKey = shallowRef<RelationGraphPresetKey>('industrialChain');
const selectedItem = shallowRef<null | SelectedItem>(null);

const graphOptions: RGOptions = {
  defaultJunctionPoint: 'border',
  defaultExpandHolderPosition: 'right',
  defaultLineColor: '#d9eef0',
  defaultLineWidth: 1,
  defaultNodeBorderColor: '#bfe9ec',
  defaultNodeBorderWidth: 1,
  defaultNodeColor: '#f7fefe',
  defaultNodeHeight: 36,
  defaultNodeWidth: 126,
  layout: {
    from: 'left',
    layoutName: 'tree',
    levelDistance: '150,110,110',
  },
  reLayoutWhenExpandedOrCollapsed: true,
};

const currentPreset = computed<
  NonNullable<(typeof relationGraphPresets)[number]>
>(() => {
  return (
    relationGraphPresets.find(
      (preset) => preset.key === currentPresetKey.value,
    ) ?? relationGraphPresets[0]
  );
});

const graphStats = computed(() => [
  {
    label: '节点数',
    color: 'blue',
    value: String(countGraphNodes(currentPreset.value.data.nodes)),
  },
  {
    label: '连线数',
    color: 'purple',
    value: String(countGraphConnections(currentPreset.value.data)),
  },
  {
    label: '根节点',
    color: 'cyan',
    value: currentPreset.value.data.rootId,
  },
]);

// function getNodeData(node: RGNode) {
//   return node.data as RelationGraphNodeData | undefined;
// }

// function getNodeClass(node: RGNode) {
//   const data = getNodeData(node);
//   const kind =
//     data?.kind ??
//     (node.id === currentPreset.value.data.rootId ? 'root' : 'leaf');
//   const accent = data?.accent ?? 'cyan';

//   // 使用十六进制色值，避免 Tailwind 默认调色板在 v4 中输出 oklch()，relation-graph 内置的 html2canvas 无法解析
//   if (kind === 'root') {
//     return accent === 'blue'
//       ? 'border-[#60a5fa] bg-[#3b82f6] text-white shadow-[0_12px_24px_rgba(59,130,246,0.18)]'
//       : 'border-[#22d3ee] bg-[#22d3ee] text-white shadow-[0_12px_24px_rgba(34,211,238,0.18)]';
//   }

//   if (accent === 'blue') {
//     if (kind === 'section') {
//       return 'border-[#bfdbfe] bg-[#bfdbfe] text-[#172554]';
//     }

//     if (kind === 'category') {
//       return 'border-[#bfdbfe] bg-[#dbeafe] text-[#172554]';
//     }

//     return 'border-[#bfdbfe] bg-[#eff6ff] text-[#172554]';
//   }

//   if (kind === 'section') {
//     return 'border-[#a5f3fc] bg-[#a5f3fc] text-[#083344]';
//   }

//   if (kind === 'category') {
//     return 'border-[#a5f3fc] bg-[#cffafe] text-[#083344]';
//   }

//   return 'border-[#a5f3fc] bg-[#ecfeff] text-[#083344]';
// }

let loadVersion = 0;

async function syncGraph() {
  const version = ++loadVersion;
  const preset = currentPreset.value;

  selectedItem.value = null;
  await nextTick();

  if (version !== loadVersion) {
    return;
  }

  const instance = graphRef.value;
  if (!instance) {
    return;
  }

  await instance.setJsonData(preset.data);

  if (version !== loadVersion) {
    return;
  }

  const graph = instance.getInstance();
  graph.moveToCenter();
  graph.zoomToFit();
}

watch(
  currentPresetKey,
  () => {
    void syncGraph();
  },
  { immediate: true },
);

function switchPreset(key: RelationGraphPresetKey) {
  currentPresetKey.value = key;
}

function reloadCurrentGraph() {
  void syncGraph();
}

function centerGraph() {
  graphRef.value?.getInstance().moveToCenter();
}

function zoomGraph() {
  graphRef.value?.getInstance().zoomToFit();
}

function handleNodeClick(node: RGNode, _event: RGUserEvent) {
  const nodeData = node.data as RelationGraphNodeData | undefined;

  selectedItem.value = {
    kind: 'node',
    title: node.text ?? node.id,
    details: [
      { label: 'ID', value: node.id },
      { label: '级别', value: nodeData?.kind ?? '未填写' },
      { label: '分类', value: nodeData?.category ?? '未填写' },
      { label: '编码', value: nodeData?.code ?? '无' },
      { label: '说明', value: nodeData?.summary ?? '暂无说明' },
    ],
  };
}

function handleLineClick(line: RGLine, link: RGLink, _event: RGUserEvent) {
  selectedItem.value = {
    kind: 'line',
    title:
      line.text ??
      `${link.fromNode.text ?? link.fromNode.id} → ${link.toNode.text ?? link.toNode.id}`,
    details: [
      { label: '起点', value: line.from },
      { label: '终点', value: line.to },
      { label: '关系', value: line.text ?? '关联' },
    ],
  };
}
</script>

<template>
  <Page
    :description="currentPreset.description"
    :title="$t('demos.features.relationGraph')"
  >
    <div class="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div class="space-y-4">
        <Card title="示例切换">
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="preset in relationGraphPresets"
              :key="preset.key"
              :type="preset.key === currentPreset.key ? 'primary' : 'default'"
              @click="switchPreset(preset.key)"
            >
              {{ preset.title }}
            </Button>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <Tag
              v-for="item in graphStats"
              :key="item.label"
              :color="item.color"
            >
              {{ item.label }}：{{ item.value }}
            </Tag>
          </div>

          <div class="mt-4 text-sm leading-6 text-foreground/70">
            {{ currentPreset.description }}
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <Button type="primary" @click="reloadCurrentGraph">
              重新加载当前示例
            </Button>
            <Button @click="centerGraph">居中图谱</Button>
            <Button @click="zoomGraph">缩放适配</Button>
          </div>
        </Card>

        <Card title="当前选中">
          <template v-if="selectedItem">
            <div class="mb-3 flex items-center gap-2">
              <Tag :color="selectedItem.kind === 'node' ? 'blue' : 'green'">
                {{ selectedItem.kind === 'node' ? '节点' : '连线' }}
              </Tag>
              <span class="font-medium text-foreground">{{
                selectedItem.title
              }}</span>
            </div>

            <Descriptions :column="1" bordered size="small">
              <DescriptionsItem
                v-for="detail in selectedItem.details"
                :key="detail.label"
                :label="detail.label"
              >
                {{ detail.value }}
              </DescriptionsItem>
            </Descriptions>
          </template>

          <div
            v-else
            class="rounded-lg border border-dashed border-border/60 px-4 py-5 text-sm text-foreground/60"
          >
            点击图中的节点或连线，右侧会展示结构化信息。
          </div>
        </Card>
      </div>

      <Card :body-style="{ padding: '16px' }" title="关系图谱">
        <template #extra>
          <Tag :color="currentPreset.tagColor">{{ currentPreset.title }}</Tag>
        </template>

        <div
          class="h-[680px] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/10 p-2"
        >
          <RelationGraph
            ref="graphRef"
            class="h-full w-full"
            :on-line-click="handleLineClick"
            :on-node-click="handleNodeClick"
            :options="graphOptions"
          >
            <!-- <template #node="{ node }">
              <div
                class="flex h-full w-full items-center justify-center rounded-full border px-3 text-center text-[12px] font-medium leading-tight shadow-sm transition-all"
                :class="getNodeClass(node)"
              >
                {{ node.text ?? node.id }}
              </div>
            </template> -->
          </RelationGraph>
        </div>
      </Card>
    </div>
  </Page>
</template>
