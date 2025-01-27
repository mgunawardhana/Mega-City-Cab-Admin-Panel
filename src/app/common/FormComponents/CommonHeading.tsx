import React from 'react';

export default function CommonHeading({ title }: { title: string }) {
	return (
		<div className="grid grid-cols-12 gap-[15px] w-full">
			<div className="col-span-12">
				<h6 className="text-[12px] sm:text-[12px] lg:text-[12px] text-gray-800 font-400 leading-[1.2]">
					<span>
						<strong>{title}</strong>
					</span>
				</h6>
			</div>
		</div>
	);
}
