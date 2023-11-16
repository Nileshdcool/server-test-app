import React from "react";
import Label from "../../Components/label";
import { getFIDetails } from "../../Redux/Services/Fi";
import { useParams } from "react-router-dom";

function ResidenceFinalStatus() {
  const { id } = useParams();
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const response = await getFIDetails({
        applicantUniqueId: id,
      });
      setData(response);
    })();
  }, []);
  return (
    <div>
      {data?.residence?.finalStatus ? (
        <Label
          label="Residence Final Status"
          value={data?.residence?.finalStatus}
        />
      ) : (
        <Label
          label="Residence Final Status"
          value={"Pending"}
        />
      )}
    </div>
  );
}

export default ResidenceFinalStatus;
