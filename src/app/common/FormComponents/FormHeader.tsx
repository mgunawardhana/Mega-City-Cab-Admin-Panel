/* eslint-disable */
import React from 'react';

function FormHeader(props: any) {
	return (
		<div className="grid grid-cols-12 gap-[15px] w-full ">
			<div className="col-span-12 grid grid-cols-12 border border-gray-300 rounded-[2px]">
				<div className="col-span-12 px-[7px] py-[7px] rounded-t-[6px] bg-white">
					<h6 className="text-[14px] sm:text-[14px] lg:text-[14px] text-gray-800 font-500 leading-[1.2]">
						{props.title ? props.title : ''}
					</h6>
				</div>
			</div>
		</div>
	);
}

export default FormHeader;
