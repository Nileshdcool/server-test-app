import React from 'react';
import Label from "../../Components/label";
import { getFIDetails } from "../../Redux/Services/Fi";
import { useParams } from "react-router-dom";

function OfficeFinalStatus() {
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
        {data?.office?.finalStatus ? (
          <Label
            label="Office Final Status"
            value={data?.office?.finalStatus}
          />
        ) : (
          <>
            {" "}
            <Label
              label="Office Final Status"
              value={"Pending"}
            />{" "}
          </>
        )}
      </div>
    );
}

export default OfficeFinalStatus;
