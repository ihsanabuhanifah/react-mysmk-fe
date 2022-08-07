import LoginImage from "../../image/login.png";
export default function Layout({ children }) {
  return (
    <main onClick={(e)=> {
      console.log(e.key, 'ff')
    } } className="w-screen h-screen flex items-center justify-center bg-gray-200 ">
      <div className="grid grid-cols-8 h-full  lg:h-5/6 lg:w-[70%] bg-white border  ">
        <div
          style={{
            backgroundImage: `url(${LoginImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          className=" col-span-1 lg:col-span-4  h-full w-full bg-green-500 "
        ></div>
        <div className=" col-span-7 lg:col-span-4 h-full w-full flex items-center justify-center ">
          <div className="w-[80%]">{children}</div>
        </div>
      </div>
    </main>
  );
}
