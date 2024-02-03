import SignIn from "@/src/components/Buttons/SignIn";

async function Login() {

return (
  <div className="flex justify-center flex-col items-center mt-20 lg:mt-40 text-2xl">
    <span className="mb-10">You need to be connected to access Booking app !</span>
    <SignIn />
  </div>
    )};

export default Login;