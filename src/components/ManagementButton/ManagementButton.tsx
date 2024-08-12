import React, { CSSProperties, useState } from 'react';
import './ManagementButton.style.sass';
interface IManagementButton {
	content: React.ReactNode | string;
	styled?: CSSProperties;
	className?: string;
	isSelect?: boolean;
}

export default function ManagementButton({
	content = '',
	styled,
	className,
	isSelect = false,
}: IManagementButton) {
	const [isActive, setIsActive] = useState<boolean>(isSelect);
	const changeActive = (): void => {
		setIsActive((v) => {
			return !v;
		});
	};
	return (
		<button
			onClick={changeActive}
			className={
				'management-button ' +
				(className ?? '') +
				(isActive ? ' management-button--active' : '')
			}
			style={styled}
		>
			{content}
		</button>
	);
}
