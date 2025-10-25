import { useParams } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";

function FundraiserPage() {
    const { id } = useParams();
    const { fundraiser, isLoading, error } = useFundraiser(id);
  
  if (isLoading) {
      return (<p>loading...</p>)
  }

  if (error) {
      return (<p>{error.message}</p>)
  }

    return (
        <div>
            <h2>{fundraiser.title}</h2>
            <h3>Created at: {fundraiser.date_created}</h3>
            <h3>{`Status: ${fundraiser.is_open}`}</h3>
            <h3>Pledges:</h3>
            <ul>
                {fundraiser.pledges.map((pledgeData, key) => {
                    return (
                        <li key={key}>
                            {pledgeData.amount} from {pledgeData.supporter}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default FundraiserPage;