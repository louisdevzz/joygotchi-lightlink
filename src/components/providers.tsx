"use client";
import { useState, type ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";


export default function Providers(props: { children: ReactNode }) {

	return (
		<ThirdwebProvider>
			{props.children}
		</ThirdwebProvider>
	);
}