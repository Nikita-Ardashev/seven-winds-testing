import { modelRow, modelTree, modelEntity, modelFullRow } from '@/store/modelTreeRows';
import { Instance } from 'mobx-state-tree';

export interface IEntity extends Instance<typeof modelEntity> {}
export interface IRow extends Instance<typeof modelRow> {}
export interface IFullRow extends Instance<typeof modelFullRow> {}
export interface ITree extends Instance<typeof modelTree> {}
export interface IChangeRow {
	current: ITree;
	changed: ITree[];
}
