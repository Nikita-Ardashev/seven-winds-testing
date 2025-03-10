import './ProjectTable.style.sass';
import { memo, ReactNode, useCallback } from 'react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { EntityTree } from '@/store/treeRows';
import { ITree } from '@/model/types';
import ProjectTableRow from './Row/ProjectTableRow';

interface IProjectTableRow {
	level: number;
	tree: ITree[];
}

const ProjectTable = memo(
	observer(function () {
		const tree = EntityTree.getTree;
		const renderRows = useCallback(
			({ tree, level }: IProjectTableRow): ReactNode => {
				return tree.map((r) => {
					return (
						<React.Fragment key={r.id}>
							<ProjectTableRow level={level} tree={r} />
							{r.child.length !== 0 &&
								renderRows({
									tree: r.child,
									level: level + 1,
								})}
						</React.Fragment>
					);
				});
			},
			[tree],
		);

		return (
			<table className="project-table">
				<thead>
					<tr>
						<th
							scope="col"
							style={{
								width: Math.max(
									EntityTree.getDepthTree * 20 + 12 + 54,
									110,
								),
							}}
						>
							Уровень
						</th>
						<th scope="col">Наименование работ</th>
						<th scope="col">Основная з/п</th>
						<th scope="col">Оборудование</th>
						<th scope="col">Накладные расходы</th>
						<th scope="col">Сметная прибыль</th>
					</tr>
				</thead>
				<tbody>{renderRows({ tree: tree, level: 0 })}</tbody>
			</table>
		);
	}),
);

export default ProjectTable;
