"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import api from "../../../lib/api";

interface Property {
  id: number;
  address: string;
  property_type?: string;
  rooms?: number;
  m2?: number;
  purchase_price?: number;
}

interface QuickStats {
  total_properties: number;
  total_value: number;
  monthly_income: number;
  monthly_expenses: number;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load properties
      const propertiesRes = await api.get("/properties");
      setProperties(propertiesRes.data);

      // Calculate basic stats
      const totalProperties = propertiesRes.data.length;
      const totalValue = propertiesRes.data.reduce(
        (sum: number, p: Property) => sum + (p.purchase_price || 0), 
        0
      );

      setStats({
        total_properties: totalProperties,
        total_value: totalValue,
        monthly_income: 0, // This would come from rental contracts
        monthly_expenses: 0 // This would come from financial movements
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const quickActions = [
    {
      title: "Nueva Propiedad",
      description: "Agregar una propiedad al portafolio",
      href: "/dashboard/properties",
      icon: "🏠",
      color: "bg-blue-500 hover:bg-blue-600",
      primary: true
    },
    {
      title: "Análisis Financiero",
      description: "Ver detalles financieros y análisis",
      href: "/financial-agent",
      icon: "📊",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Contratos",
      description: "Gestionar contratos de alquiler",
      href: "/financial-agent/contracts",
      icon: "📄",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Movimientos",
      description: "Ver movimientos financieros",
      href: "/financial-agent/movements",
      icon: "💰",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Cargando información...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Dashboard" 
      subtitle="Vista general de tu portafolio inmobiliario"
      showBreadcrumbs={false}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600">🏠</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Propiedades
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.total_properties || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Valor Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(stats?.total_value || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ingresos Mensuales
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(stats?.monthly_income || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <span className="text-orange-600">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gastos Mensuales
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(stats?.monthly_expenses || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.color} text-white rounded-lg p-6 block hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{action.icon}</span>
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm opacity-90 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Propiedades Recientes
            </h3>
            <Link
              href="/dashboard/properties"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Ver todas →
            </Link>
          </div>
          
          {properties.length > 0 ? (
            <div className="space-y-4">
              {properties.slice(0, 3).map((property) => (
                <div key={property.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">🏠</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{property.address}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      {property.property_type && <span>{property.property_type}</span>}
                      {property.rooms && <span className="ml-2">{property.rooms} habitaciones</span>}
                      {property.m2 && <span className="ml-2">{property.m2}m²</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    {property.purchase_price && (
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(property.purchase_price)}
                      </p>
                    )}
                    <Link
                      href={`/financial-agent/property/${property.id}`}
                      className="text-xs text-blue-600 hover:text-blue-500"
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No hay propiedades</h3>
              <p className="text-sm text-gray-500 mb-4">
                Comienza agregando tu primera propiedad al portafolio
              </p>
              <Link
                href="/dashboard/properties"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Agregar Propiedad
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Made in Chaparrito Footer */}
      <div className="mt-8 text-center">
        <p className="text-2xl font-bold text-teal-700 animate-pulse">
          🏠 Made in Chaparrito 🚀
        </p>
        <p className="text-sm text-teal-600 mt-2">
          Con amor desde el mejor lugar del mundo
        </p>
      </div>
    </Layout>
  );
}
