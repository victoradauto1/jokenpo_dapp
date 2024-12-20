import { doLogin, doLogout } from "@/Web3Services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Header(){

  const router = useRouter()


  useEffect(() => {
      const account = localStorage.getItem("account");
      const isAdmin = localStorage.getItem("isAdmin");
  
      if (account && isAdmin !== null) {
     
          if (isAdmin === "true") {
              doLogin()
                .then(result=>{
                  localStorage.setItem("isAdmin", "false");
                  if(!result.isAdmin) router.push("/game")
                })
                .catch(err =>{
                  console.error(err);
                  onLogoutClick()
                })
          } else {
              router.push("/game");
          }
      } 
  }, [router]);

  function onLogoutClick(){
    doLogout();
    router.push("/");
  }

    return(
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a href="/game" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <span className="fs-4">JO KEN PO! dApp</span>
      </a>
      <div className="col-md-3 text-end">
        <button type= "button" className="btn btn-outline-danger me-2" onClick={onLogoutClick}>Logout </button>
      </div>
    </header>
    )
}

export default Header