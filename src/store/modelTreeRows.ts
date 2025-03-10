import {
	applySnapshot,
	cast,
	destroy,
	flow,
	IAnyModelType,
	IMSTArray,
	Instance,
	types,
} from 'mobx-state-tree';

import {
	fetchCreateRowInEntity,
	fetchDeleteRow,
	fetchGetTreeRows,
	fetchUpdateRow,
} from '@/model/api.service';
import { IChangeRow, ITree } from '@/model/types';

export interface ITreeRowWithSiblings {
	node: ITree;
	prevNode: ITree | null;
	nextNode: ITree | null;
	parentNode: ITree | null;
}

export const createLocalRow = (addData?: Partial<ITree>): ITree => {
	const row: ITree = {
		equipmentCosts: 0,
		estimatedProfit: 0,
		mainCosts: 0,
		overheads: 0,
		rowName: '',
		parentId: 0,
		child: [] as unknown as IMSTArray<IAnyModelType>,
		id: 0,
		machineOperatorSalary: 0,
		materials: 0,
		mimExploitation: 0,
		salary: 0,
		supportCosts: 0,
		total: 0,
		isNowCreate: true,
		isParentEntity: false,
	};
	return Object.assign(row, addData);
};

const createParentEntity = (tree: ITree[]) => {
	const startRow = createLocalRow();
	startRow.isParentEntity = true;
	startRow.parentId = null;
	tree.push(startRow);
};

export const modelEntity = types.model({
	id: types.number,
	rowName: types.string,
});

export const modelRow = types.compose(
	types.model({
		equipmentCosts: types.number,
		estimatedProfit: types.number,
		mainCosts: types.number,
		overheads: types.number,
	}),
	modelEntity,
);

export const modelFullRow = types.compose(
	modelRow,
	types.model({
		machineOperatorSalary: types.number,
		materials: types.number,
		mimExploitation: types.number,
		salary: types.number,
		supportCosts: types.number,
		parentId: types.maybeNull(types.number),
	}),
);

export const modelTree = types.compose(
	types.model({
		child: types.array(types.late((): IAnyModelType => modelTree)),
		isNowCreate: types.optional(types.boolean, false),
		total: types.number,
		isParentEntity: types.optional(types.boolean, false),
	}),
	modelFullRow,
);

export const modelEntityTree = types
	.model({
		tree: types.array(modelTree),
		isNowEdited: types.boolean,
		depthTree: types.optional(types.number, 1),
	})
	.views((self) => ({
		get getTree() {
			return self.tree;
		},
		get getIsNowEdited() {
			return self.isNowEdited;
		},
		get getDepthTree() {
			return self.depthTree;
		},
		getTreeRowById<B extends boolean = false>(
			id: number,
			isAddSiblings?: B,
		): B extends true ? ITreeRowWithSiblings | null : ITree | null {
			const findRow = (
				tree: typeof self.tree,
				id: number,
				parent: ITree | null = null,
			): ITree | ITreeRowWithSiblings | null => {
				for (let i = 0; i < tree.length; i++) {
					const node = tree[i];
					if (node.id === id) {
						if (isAddSiblings) {
							return {
								node,
								prevNode: i > 0 ? tree[i - 1] : null,
								nextNode: i < tree.length - 1 ? tree[i + 1] : null,
								parentNode: parent,
							};
						}
						return node;
					}
					const result = findRow(node.child, id, node);
					if (result) {
						return result;
					}
				}
				return null;
			};

			return findRow(self.tree, id) as B extends true
				? ITreeRowWithSiblings | null
				: ITree | null;
		},
		getCountAllChildNodes(node: ITree | null): number {
			if (!node) return 0;

			let count = 0;

			const counting = (current: ITree) => {
				count += current.child.length;
				for (const child of current.child) {
					counting(child);
				}
			};

			counting(node);

			return count;
		},
		getTreeLengthBetweenNode(id: number) {
			const nodeWithSiblings = this.getTreeRowById(id, true);
			if (!nodeWithSiblings) return 0;

			return this.getCountAllChildNodes(nodeWithSiblings.prevNode);
		},
	}))
	.actions((self) => ({
		setDepthTree(value: number) {
			self.depthTree = Math.max(self.depthTree, value);
		},
		setTree: flow(function* () {
			try {
				const tree: ITree[] = yield fetchGetTreeRows();
				if (tree.length === 0 || !tree) {
					createParentEntity(self.tree);
					return;
				}
				self.tree = cast(tree);
				self.isNowEdited = false;
			} catch (e) {
				console.error(e);
			}
		}),
		setIsNowEdited(isNowEdited: boolean) {
			self.isNowEdited = isNowEdited;
		},
		setIsNowCreate(row: Instance<typeof modelTree>, isNowCreate: boolean) {
			row.isNowCreate = isNowCreate;
		},
		addRow(parentTree: ITree) {
			const row = createLocalRow();
			row.parentId = parentTree.id;
			parentTree.child.push(row);
		},

		saveRow: flow(function* (tree: ITree) {
			try {
				const r: IChangeRow = yield fetchCreateRowInEntity(tree);
				tree.isNowCreate = false;
				applySnapshot(tree, { ...tree, ...r.current });
			} catch (e) {
				console.error(e);
			}
		}),

		updateRow: flow(function* (tree: ITree) {
			try {
				const r: IChangeRow = yield fetchUpdateRow(tree);
				if (r.changed.length === 0) return;
				for (const changed of r.changed) {
					const rc = self.getTreeRowById(changed.id);
					if (rc === null) continue;
					applySnapshot(rc, { ...rc, ...changed });
				}
			} catch (e) {
				console.error(e);
			}
		}),

		deleteRow(tree: ITree) {
			try {
				tree.id !== 0 && fetchDeleteRow(tree.id);
				destroy(tree);
				self.depthTree = 0;
				if (self.tree.length === 0) {
					createParentEntity(self.tree);
				}
			} catch (e) {
				console.error('Не удалось удалить проект', e);
			}
		},
		changeRow(tree: ITree, newDataRow: Partial<ITree>) {
			applySnapshot(tree, { ...tree, ...newDataRow });
		},
	}));
