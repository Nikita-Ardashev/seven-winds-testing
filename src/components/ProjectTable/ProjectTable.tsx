import { ITree } from '@/model/types';
import { ProjectTableRow } from '../ProjectTableRow';
import './ProjectTable.style.sass';
import { ReactNode } from 'react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { EntityTree } from '@/store/treeRows';
import { Instance } from 'mobx-state-tree';

interface IProjectTableRow {
	level: number;
	tree: ITree[];
	parentIndex: number;
}

const ProjectTable = observer((props: { entityTree: Instance<typeof EntityTree> }) => {
	const treeData = props.entityTree;
	const renderRows = ({ tree, level, parentIndex }: IProjectTableRow): ReactNode => {
		return tree.map((r, i) => {
			return (
				<React.Fragment key={`parent-${i}-${r.id}`}>
					<ProjectTableRow
						level={level}
						row={r}
						key={`${i}-${r.id}`}
						childIndex={i}
						parentIndex={parentIndex}
					/>
					{r.child.length !== 0 &&
						renderRows({
							tree: r.child,
							level: level + 1,
							parentIndex: parentIndex,
						})}
				</React.Fragment>
			);
		});
	};

	return (
		<table className="project-table">
			<thead>
				<tr>
					<th scope="col">Уровень</th>
					<th scope="col">Наименование работ</th>
					<th scope="col">Основная з/п</th>
					<th scope="col">Оборудование</th>
					<th scope="col">Накладные расходы</th>
					<th scope="col">Сметная прибыль</th>
				</tr>
			</thead>
			<tbody>
				{renderRows({ tree: treeData.getTree, level: 0, parentIndex: 0 })}
			</tbody>
		</table>
	);
});

export default ProjectTable;
