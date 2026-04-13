<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

import type { ErrorLogItem } from '#/store/error-log-demo';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Descriptions,
  DescriptionsItem,
  message,
  Modal,
  Table,
  Tag,
} from 'ant-design-vue';

import { demoErrorApi } from '#/api/demo/error';
import { $t } from '#/locales';
import { ErrorLogTypeEnum, useErrorLogDemoStore } from '#/store/error-log-demo';

defineOptions({ name: 'ErrorLogDemo' });

const store = useErrorLogDemoStore();
const detailOpen = ref(false);
const current = ref<ErrorLogItem | null>(null);

const imgList = ref<string[]>([]);

const columns: TableColumnsType<ErrorLogItem> = [
  {
    dataIndex: 'type',
    key: 'type',
    title: $t('demos.errorLog.colType'),
    width: 100,
  },
  { dataIndex: 'url', ellipsis: true, key: 'url', title: 'URL', width: 200 },
  {
    dataIndex: 'time',
    key: 'time',
    title: $t('demos.errorLog.colTime'),
    width: 180,
  },
  {
    dataIndex: 'file',
    ellipsis: true,
    key: 'file',
    title: $t('demos.errorLog.colFile'),
    width: 160,
  },
  { dataIndex: 'name', ellipsis: true, key: 'name', title: 'Name', width: 140 },
  {
    dataIndex: 'message',
    ellipsis: true,
    key: 'message',
    title: $t('demos.errorLog.colMessage'),
    width: 260,
  },
  {
    dataIndex: 'stack',
    ellipsis: true,
    key: 'stack',
    title: $t('demos.errorLog.colStack'),
  },
  {
    fixed: 'right',
    key: 'action',
    title: $t('demos.errorLog.action'),
    width: 90,
  },
];

const dataSource = computed(() => store.list);

function typeColor(type: ErrorLogTypeEnum) {
  switch (type) {
    case ErrorLogTypeEnum.AJAX: {
      return 'red';
    }
    case ErrorLogTypeEnum.PROMISE: {
      return 'blue';
    }
    case ErrorLogTypeEnum.RESOURCE: {
      return 'cyan';
    }
    case ErrorLogTypeEnum.VUE: {
      return 'green';
    }
    default: {
      return 'default';
    }
  }
}

function openDetail(record: ErrorLogItem) {
  current.value = record;
  detailOpen.value = true;
}

function fireVueError() {
  throw new Error('fire vue error!');
}

function fireResourceError() {
  imgList.value.push(`${Date.now()}.png`);
  store.add({
    type: ErrorLogTypeEnum.RESOURCE,
    url: `${window.location.origin}${imgList.value.at(-1)}`,
    message: $t('demos.errorLog.resourceFailed'),
  });
}

async function fireAjaxError() {
  try {
    await demoErrorApi();
  } catch (error: unknown) {
    const err = error as {
      config?: { url?: string };
      message?: string;
      stack?: string;
    };
    store.add({
      type: ErrorLogTypeEnum.AJAX,
      url: String(err?.config?.url ?? window.location.href),
      message: err?.message ?? 'Ajax Error',
      stack: err?.stack,
    });
  }
}

function clearAll() {
  store.clear();
  message.success($t('demos.errorLog.cleared'));
}

onMounted(() => {
  if (import.meta.env.DEV) {
    message.info($t('demos.errorLog.devHint'));
  }
});
</script>

<template>
  <Page
    :description="$t('demos.errorLog.description')"
    :title="$t('demos.errorLog.title')"
  >
    <template v-for="src in imgList" :key="src">
      <img v-show="false" :src="src" alt="" />
    </template>

    <div class="mb-4 flex flex-wrap gap-2">
      <Button type="primary" @click="fireVueError">
        {{ $t('demos.errorLog.fireVue') }}
      </Button>
      <Button type="primary" @click="fireResourceError">
        {{ $t('demos.errorLog.fireResource') }}
      </Button>
      <Button type="primary" @click="fireAjaxError">
        {{ $t('demos.errorLog.fireAjax') }}
      </Button>
      <Button @click="clearAll">
        {{ $t('demos.errorLog.clear') }}
      </Button>
    </div>

    <Table
      :columns="columns"
      :data-source="dataSource"
      :pagination="{ pageSize: 10 }"
      :scroll="{ x: 1200 }"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <Tag :color="typeColor(record.type)">{{ record.type }}</Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <Button
            size="small"
            type="link"
            @click="openDetail(record as ErrorLogItem)"
          >
            {{ $t('demos.errorLog.detail') }}
          </Button>
        </template>
        <template v-else>
          {{ record[column.key as keyof ErrorLogItem] }}
        </template>
      </template>
    </Table>

    <Modal
      v-model:open="detailOpen"
      :footer="null"
      :title="$t('demos.errorLog.detail')"
      width="800px"
      @cancel="current = null"
    >
      <Descriptions v-if="current" :column="1" bordered size="small">
        <DescriptionsItem label="type">
          <Tag :color="typeColor(current.type)">{{ current.type }}</Tag>
        </DescriptionsItem>
        <DescriptionsItem label="URL">{{ current.url }}</DescriptionsItem>
        <DescriptionsItem label="time">{{ current.time }}</DescriptionsItem>
        <DescriptionsItem v-if="current.file" label="file">
          {{ current.file }}
        </DescriptionsItem>
        <DescriptionsItem v-if="current.name" label="name">
          {{ current.name }}
        </DescriptionsItem>
        <DescriptionsItem label="message">
{{
          current.message
        }}
</DescriptionsItem>
        <DescriptionsItem v-if="current.stack" label="stack">
          <pre class="max-h-60 overflow-auto whitespace-pre-wrap text-xs">{{
            current.stack
          }}</pre>
        </DescriptionsItem>
      </Descriptions>
    </Modal>
  </Page>
</template>
