/* eslint-disable */
import React from 'react';

function NavigationViewComp(props: any) {
	return (
		<div className="grid grid-cols-12 gap-[16px] w-full px-[15px] py-[4px]">
			<div className="col-span-12">
				<h6 className="w-full flex flex-wrap items-center gap-[5px] text-[8px] sm:text-[10px] lg:text-[12px] text-gray-600 font-500 leading-[1.2]">
					<span>Live Aquaria</span> /{' '}
					<span className="text-primaryBlueLight font-600">{props.title ? props.title : ''}</span>				
				</h6>
			</div>
		</div>
	);
}

export default NavigationViewComp;
