import { useLocation, useNavigate } from '@/lib/router';
import { useEffect } from "react";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Track 404 errors if needed
  }, [location.pathname]);

  return (
    <>
      <Seo title="Страница не найдена" description="Запрошенная страница отсутствует." path={location.pathname} noIndex />
      <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <button 
          onClick={() => navigate('/')} 
          className="text-primary underline hover:text-primary/90"
        >
          Return to Home
        </button>
      </div>
      </div>
    </>
  );
};

export default NotFound;
