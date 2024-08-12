import TileIcon from '@img/tile.svg';
import { useState } from 'react';
import './ProjectTile.style.sass';

interface IProjectTile {
	name: string;
	isSelect?: boolean;
}

export default function ProjectTile({ name, isSelect = false }: IProjectTile) {
	const [isActive, setIsActive] = useState<boolean>(isSelect);
	const changeActive = (): void => {
		setIsActive((v) => {
			return !v;
		});
	};
	return (
		<button
			onClick={changeActive}
			type="button"
			className={'project-tile' + (isActive ? ' project-tile--active' : '')}
		>
			<img src={TileIcon} alt="Иконка проекта" />
			<p>{name}</p>
		</button>
	);
}
