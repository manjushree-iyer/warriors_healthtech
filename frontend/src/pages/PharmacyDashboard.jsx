import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import pharmacyService from '../services/pharmacyService';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Truck,
  Plus,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { useState } from 'react';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: prescriptionsData, executeFetch: refreshPrescriptions } = useFetch(() => pharmacyService.getPharmacyPrescriptions(user.id), []);
  const { data: inventoryData, executeFetch: searchInventory } = useFetch(() => pharmacyService.searchMedicine(searchTerm), [searchTerm]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await pharmacyService.updatePrescriptionStatus(id, status);
      refreshPrescriptions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-950">Pharmacy Control</h1>
          <p className="text-slate-500 mt-1">Inventory management and prescription fulfillment.</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" /> Add Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prescription Requests */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card !p-0">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy-950 flex items-center">
                <ClipboardList className="mr-2 text-teal-600" size={24} />
                Prescription Requests
              </h3>
              <span className="bg-amber/10 text-amber px-3 py-1 rounded-full text-xs font-bold uppercase">Pending Fulfillment</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-bold">Patient</th>
                    <th className="px-6 py-4 font-bold">Medicine</th>
                    <th className="px-6 py-4 font-bold">Instructions</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 uppercase text-xs">
                  {prescriptionsData?.prescriptions?.length > 0 ? (
                    prescriptionsData.prescriptions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-navy-900">PT-{p.patient_id}</td>
                        <td className="px-6 py-4 font-bold text-teal-600">{p.medicine_name}</td>
                        <td className="px-6 py-4 text-slate-500 normal-case">{p.dosage} - {p.instructions}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md font-bold ${p.status === 'fulfilled' ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'}`}>
                            {p.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.status !== 'fulfilled' && (
                            <button 
                              onClick={() => handleUpdateStatus(p.id, 'fulfilled')}
                              className="text-teal-600 hover:text-teal-700 font-bold"
                            >
                              Fulfill
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400">No active prescription requests.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Local Inventory Search */}
          <div className="card">
            <h3 className="text-xl font-bold text-navy-950 mb-6">Inventory Audit</h3>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Quick search medicines..." 
                className="input-field pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {inventoryData?.medicines?.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-500/20 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-teal-600">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-navy-950">{med.name}</p>
                      <p className="text-sm text-slate-500">In Stock: <span className={med.stock < 20 ? 'text-rose font-bold' : 'font-bold'}>{med.stock} units</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy-950">₹{med.price}</p>
                    <button className="text-teal-600 text-xs font-bold flex items-center mt-1 group">
                      Restock <ArrowUpRight size={14} className="ml-1 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Sidebar */}
        <div className="space-y-6">
          <div className="card bg-teal-50 border-teal-100">
            <h4 className="text-teal-900 font-bold mb-4 flex items-center">
              <CheckCircle2 size={18} className="mr-2" />
              Efficiency Score
            </h4>
            <div className="text-4xl font-extrabold text-teal-600 mb-2">98.4%</div>
            <p className="text-sm text-teal-700 leading-relaxed">Your pharmacy is fulfilling orders 20% faster than regional average.</p>
          </div>

          <div className="card border-rose/20">
            <h4 className="text-rose font-bold mb-4 flex items-center uppercase tracking-wider text-xs">
              <AlertTriangle size={16} className="mr-2" />
              Low Stock Alerts
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-600">Paracetamol 500mg</span>
                <span className="text-rose font-bold">5 left</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-600">Amoxicillin</span>
                <span className="text-rose font-bold">12 left</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-rose text-white rounded-xl font-bold text-sm hover:bg-rose/90 transition-all">Bulk Reorder</button>
          </div>

          <div className="card">
            <h4 className="font-bold text-navy-950 mb-4">Latest Deliveries</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="text-slate-400" size={18} />
                <span className="text-slate-600">Order #TRK-882 arriving in 2h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
