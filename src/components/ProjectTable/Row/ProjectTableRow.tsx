import './ProjectTableRow.style.sass';

import FileIcon from '@img/file.svg';
import TrashIcon from '@img/trash.svg';
import { observer } from 'mobx-react-lite';
import {
	HTMLInputTypeAttribute,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { IRow, ITree } from '@/model/types';
import { EntityTree } from '@/store/treeRows';

interface IProjectTableRow {
	level: number;
	tree: ITree;
}

interface newRowData extends Partial<IRow> {
	[key: string]: string | number | undefined;
}

export default memo(
	observer(function ProjectTableRow({ tree, level }: IProjectTableRow) {
		const [isEditable, setIsEditable] = useState<boolean>(false);
		const isNowOtherEditable = EntityTree.getIsNowEdited;
		const rowRef = useRef<HTMLTableRowElement>(null);

		const saveRow = useCallback(() => {
			if (tree.isNowCreate) {
				EntityTree.saveRow(tree);
			} else {
				EntityTree.updateRow(tree);
			}
			notChangeRow();
			window.onmouseup = null;
			window.onkeyup = null;
		}, [tree]);

		useEffect(() => {
			EntityTree.setDepthTree(level);
			tree.isNowCreate && changeRow();
		}, []);

		const createRow = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.currentTarget.blur();
			if (isNowOtherEditable || isEditable) return;
			EntityTree.addRow(tree);
		};

		const deleteRow = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.currentTarget.blur();
			if (isEditable || isNowOtherEditable) return;
			EntityTree.deleteRow(tree);
		};

		const changeRow = () => {
			if (isNowOtherEditable) return;
			EntityTree.setIsNowEdited(true);
			setIsEditable(true);
			window.onkeyup = (e) => {
				if (e.key === 'Enter') {
					saveRow();
					return;
				}
				if (e.key === 'Escape') {
					if (tree.isNowCreate) EntityTree.deleteRow(tree);
					notChangeRow();
					return;
				}
			};
			window.onmouseup = (e) => {
				if (rowRef.current === null) return;
				const target = (e.target as HTMLElement).closest('.table-tr');
				if (rowRef.current !== target) {
					saveRow();
					return;
				}
			};
		};

		const notChangeRow = () => {
			EntityTree.setIsNowEdited(false);
			setIsEditable(false);
			window.onkeyup = null;
		};

		const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
			const t = e.currentTarget;
			const rowField = t.name;
			const rowData: newRowData = {};
			rowData[rowField] =
				(t.type as HTMLInputTypeAttribute) === 'number' ? Number(t.value) : t.value;
			EntityTree.changeRow(tree, rowData);
		};

		const inputProps = {
			type: 'number',
			onChange: changeField,
			onDoubleClick: changeRow,
			readOnly: !isEditable,
		};
		const maxHeightLine = 60 * (EntityTree.getTreeLengthBetweenNode(tree.id) + 1);
		return (
			<tr className="table-tr" ref={rowRef}>
				<td
					className="table-tr__level"
					style={{
						paddingLeft: level * 20 + 12,
						width: Math.max(EntityTree.getDepthTree * 20 + 12 + 54, 110),
					}}
				>
					{level !== 0 && (
						<span
							className="level-lines"
							style={{
								left: level * 20 + 4,
								height: maxHeightLine === 0 ? 60 : maxHeightLine,
							}}
						></span>
					)}
					<div className={isEditable || isNowOtherEditable ? 'no-active' : ''}>
						<button
							type="button"
							className="table-tr__file"
							onClick={createRow}
						>
							{<img src={FileIcon} alt="" />}
						</button>
						{!isNowOtherEditable && (
							<button
								type="button"
								className="table-tr__trash"
								onClick={deleteRow}
							>
								<img src={TrashIcon} alt="" />
							</button>
						)}
					</div>
				</td>
				<td>
					<input
						{...inputProps}
						type="text"
						maxLength={128}
						name="rowName"
						value={tree.rowName}
					/>
				</td>
				<td>
					<input {...inputProps} name="mainCosts" value={tree.mainCosts} />
				</td>
				<td>
					<input {...inputProps} name="overheads" value={tree.overheads} />
				</td>
				<td>
					<input
						{...inputProps}
						name="equipmentCosts"
						value={tree.equipmentCosts}
					/>
				</td>
				<td>
					<input
						{...inputProps}
						name="estimatedProfit"
						value={tree.estimatedProfit}
					/>
				</td>
			</tr>
		);
	}),
);
