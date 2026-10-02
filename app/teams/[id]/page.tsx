import React from "react";

async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <div>Team Page {id}</div>;
}

export default page;
