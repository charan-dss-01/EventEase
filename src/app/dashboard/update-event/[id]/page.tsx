import React from "react";
import UpdateEventForm from "./UpdateEventForm";

export default function UpdateEventPage({ params }: { params: { id: string } }) {
  const id = React.use(params);
  return <UpdateEventForm eventId={id.id} />;
} 