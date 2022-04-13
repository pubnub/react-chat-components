import React from "react";
import "./doctor-details.scss";

type DoctorDetailsProps = {
  doctor: UUIDMetadataObject<ObjectCustom>;
  big?: boolean;
  children?: ReactNode;
};

function DoctorDetails(props: DoctorDetailsProps): JSX.Element {
  const { doctor, children, big } = props;

  return (
    <address className={`doctor-details ${big ? "big" : ""}`}>
      <img src={doctor.profileUrl} alt={`${doctor.name}'s Avatar`} />

      <div>
        <p>{doctor.name}</p>
        <small>General Practitioner</small>
      </div>

      {children}
    </address>
  );
}

export default DoctorDetails;
