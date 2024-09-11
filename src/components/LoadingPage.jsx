import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";
export default function LoadingPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
     
        <Dimmer active inverted>
          <Loader size="large" className="z-[999999]">Loading</Loader>
        </Dimmer>

       
     
    </div>
  );
}
