
import { Gavel, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">LegalAI</h3>
                <p className="text-sm text-gray-400">Kancelaria Online</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nowoczesna kancelaria prawna oferująca szybkie i profesjonalne analizy dokumentów online.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Usługi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Analiza pism</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pisma procesowe</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Konsultacje</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reprezentacja sądowa</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Informacje prawne</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Regulamin</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Polityka prywatności</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RODO</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reklamacje</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>kontakt@legalai.pl</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+48 123 456 789</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>ul. Prawnicza 1, 00-001 Warszawa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 LegalAI - Internetowa Kancelaria Prawna. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
