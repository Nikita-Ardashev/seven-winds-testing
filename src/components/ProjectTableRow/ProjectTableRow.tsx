import { HTMLInputTypeAttribute, useEffect, useState } from 'react';
import './ProjectTableRow.style.sass';
import FileIcon from '@img/file.svg';
import TrashIcon from '@img/trash.svg';
import { EntityTree } from '@/store/treeRows';
import { IRow, ITree } from '@/model/types';

interface IProjectTableRow {
	level: number;
	row: ITree;
	parentIndex: number;
	childIndex: number;
}

interface newRowData extends Partial<IRow> {
	[key: string]: string | number | undefined;
}

export default function ProjectTableRow({
	row,
	level,
	parentIndex,
	childIndex,
}: IProjectTableRow) {
	const tree = EntityTree;
	const [isEditable, setIsEditable] = useState<boolean>(false);

	const changeRow = () => {
		tree.setIsNowEdited(true);
		setIsEditable(true);
		window.onkeyup = (e) => {
			if (e.key === 'Enter') {
				if (row.isNowCreate) {
					tree.saveRow(row);
				} else {
					tree.updateRow(row);
				}
				notChangeRow();
				return;
			}
			if (e.key === 'Escape') {
				if (row.isNowCreate) tree.deleteRow(row);
				notChangeRow();
				return;
			}
		};
	};

	useEffect(() => {
		row.isNowCreate && changeRow();
	}, []);

	const notChangeRow = () => {
		tree.setIsNowEdited(false);
		setIsEditable(false);
		window.onkeyup = null;
	};

	const createRow = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.blur();
		if (tree.getIsNowEdited || isEditable) return;
		tree.setIsNowEdited(true);
		tree.addRow(row);
	};

	const deleteRow = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.blur();
		if (isEditable) return;
		tree.deleteRow(row);
	};

	const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
		const t = e.currentTarget;
		const rowField = t.name;
		const rowData: newRowData = {};
		rowData[rowField] =
			(t.type as HTMLInputTypeAttribute) === 'number' ? Number(t.value) : t.value;
		tree.changeRow(row, rowData);
	};

	const inputProps = {
		type: 'number',
		onChange: changeField,
		onDoubleClick: changeRow,
		readOnly: !isEditable,
	};
	const maxHeightLine = 60 * (parentIndex + childIndex + 1);
	return (
		<tr className="table-tr">
			<td className="table-tr__level" style={{ paddingLeft: level * 20 + 12 }}>
				{level !== 0 && (
					<span
						className="level-lines"
						style={{
							left: level * 20 + 4,
							height: maxHeightLine === 0 ? 60 : maxHeightLine,
						}}
					></span>
				)}
				<div className={isEditable ? 'no-active' : ''}>
					<button type="button" className="table-tr__file" onClick={createRow}>
						<img src={FileIcon} alt="" />
					</button>
					<button type="button" className="table-tr__trash" onClick={deleteRow}>
						<img src={TrashIcon} alt="" />
					</button>
				</div>
			</td>
			<td>
				<input
					{...inputProps}
					type="text"
					maxLength={128}
					name="rowName"
					defaultValue={row.rowName}
				/>
			</td>
			<td>
				<input {...inputProps} name="mainCosts" defaultValue={row.mainCosts} />
			</td>
			<td>
				<input {...inputProps} name="overheads" defaultValue={row.overheads} />
			</td>
			<td>
				<input
					{...inputProps}
					name="equipmentCosts"
					defaultValue={row.equipmentCosts}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					name="estimatedProfit"
					defaultValue={row.estimatedProfit}
				/>
			</td>
		</tr>
	);
}
