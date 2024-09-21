
import StatCard from "@/components/StatCard";
import {columns, Payment} from "@/components/table/column";
import {DataTable} from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";



const Admin = async () => {

	const appointments = await getRecentAppointmentList();
	

   return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
         <header className="admin-header">
				<Link href="/" className="cursor-pointer">
					<Image
						src="/assets/icons/logo-full.svg"
						alt="logo"
						height={32}
						width={162}
						className="h-8 w-fit"
						/>
				</Link>
				<p className="text-16-semibold">Admin Dashboard</p>
			</header>
			<main className="admin-main">
				<section className="w-full space-y-4">
					<p className="header">Welcome 🖐️</p>
					<p className="text-dark-700">Start the day managing your appointment</p>
				</section>
				<section className="admin-stat">
					<StatCard 
						type="appointment"
						count={appointments.scheduledCount}
						label="Scehduled Appointments"
						icon="/assets/icons/appointments.svg"
					/>
					<StatCard 
						type="pending"
						count={appointments.pendingCount}
						label="Pending Appointments"
						icon="/assets/icons/pending.svg"
					/>
						<StatCard 
						type="cancelled"
						count={appointments.cancelledCount}
						label="Cancelled Appointments"
						icon="/assets/icons/cancelled.svg"
					/>
				</section>
				<DataTable 
					data={appointments.documents}
					columns={columns}
				/>
			</main>
      </div>
   );
};

export default Admin;
