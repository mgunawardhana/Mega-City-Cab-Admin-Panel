import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

interface Option {
	label: string;
	key: string;
	children?: Option[];
}

const options: Option[] = [
	{ label: 'First option', key: '1' },
	{ label: 'Second option', key: '2' },
	{
		label: 'Multi level option',
		key: '3',
		children: [
			{ label: 'Second first', key: '3-1' },
			{
				label: 'Second second',
				key: '3-2',
				children: [
					{ label: 'Third first', key: '3-2-1' },
					{ label: 'Third second', key: '3-2-2' },
					{
						label: 'Third third',
						key: '3-2-3',
						children: [
							{ label: 'Fourth first', key: '3-2-3-1' },
							{ label: 'Fourth second', key: '3-2-3-2' },
							{ label: 'Fourth third', key: '3-2-3-3' },
							{
								label: 'Fourth fourth',
								key: '3-2-3-4',
								children: [
									{ label: 'Fifth first', key: '3-2-3-4-1' },
									{ label: 'Fifth second', key: '3-2-3-4-2' },
									{
										label: 'Fifth third',
										key: '3-2-3-4-3',
										children: [
											{ label: 'Sixth first', key: '3-2-3-4-3-1' },
											{ label: 'Sixth second', key: '3-2-3-4-3-2' }
										]
									}
								]
							}
						]
					}
				]
			},
			{ label: 'Second third', key: '3-3' }
		]
	},
	{ label: 'Fourth option', key: '4' }
];

const generateMenuItems = (options: Option[]): MenuProps['items'] => {
	return options.map((option) => ({
		key: option.key,
		label: option.label,
		children: option.children ? generateMenuItems(option.children) : undefined
	}));
};

const items = generateMenuItems(options);

const MultiLevelDropdown: React.FC = () => (
	<Dropdown menu={{ items }}>
		<a onClick={(e) => e.preventDefault()}>
			<Space>
				Cascading menu
				<DownOutlined />
			</Space>
		</a>
	</Dropdown>
);

export default MultiLevelDropdown;
