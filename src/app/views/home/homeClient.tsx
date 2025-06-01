"use client";

import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookText, FilePlus } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toggle } from "@/components/ui/toggle";
import FilterBar from "@/components/custom/search";
import TableWithPagination from "@/components/custom/table";
import {
  handleGetData,
  handleDelete,
  handleEdit,
  handleCreate,
} from "@/app/controllers/home/HomeController";

type Client = {
  id: number;
  name: string | null;
  email: string | null;
  status: boolean | null;
};

export function HomeClient() {
  const [activeSection, setActiveSection] = useState<"list" | "form" | null>(
    "list"
  );
  const [dataRegister, setDataRegister] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  //Revisar código aqui
  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
    email: z.string().min(3).endsWith("@outlook.com", {
      message: "O email deve terminar com @outlook.com",
    }),
    status: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      status: true,
    },
  });

  const filteredData = dataRegister.filter(
    (item: any) =>
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.status?.toString()?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      const data = await handleGetData();

      if (data.code === 200) {
        setDataRegister(data.data);
      } else {
        toast(data.message);
        setDataRegister([]);
      }
    }

    fetchData();
  }, []);

  async function onDelete(id: number | null) {
    const load = await handleDelete(id);
    const data = await handleGetData();

    toast(load.message);
    setDataRegister(data.data);
  }

  async function onEdit(values: any) {
    const load = await handleEdit(values);
    const data = await handleGetData();

    toast(load.message);
    setDataRegister(data.data);
  }

  async function createNewItem(values: z.infer<typeof formSchema>) {
    const load = await handleCreate(values);
    const data = await handleGetData();

    toast(load.message);
    setDataRegister(data.data);
    form.reset();
  }

  // Terminio da revisão de código
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <section className="flex justify-center py-10">
          <Toaster />
          <Card
            className="w-[48rem] p-[30px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
            style={{ borderRadius: "16px" }}
          >
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardAction>Ações</CardAction>
            </CardHeader>

            <CardContent className="flex mt-4 h-[24rem] ">
              <aside className=" bg-black backdrop-blur-md shadow-md rounded-3xl p-2 flex flex-col gap-4 border border-black/30 h-full justify-center">
                <div className="flex flex-col items-center gap-6 h-full justify-between py-4">
                  <SidebarHeader className="flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      className="size-5"
                    >
                      <rect width="256" height="256" fill="none"></rect>
                      <line
                        x1="208"
                        y1="128"
                        x2="128"
                        y2="208"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                      ></line>
                      <line
                        x1="192"
                        y1="40"
                        x2="40"
                        y2="192"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                      ></line>
                    </svg>
                  </SidebarHeader>

                  <SidebarContent className="flex flex-col gap-4">
                    <SidebarGroup className="flex justify-center">
                      <Toggle
                        className="bg-black text-white size-8 cursor-pointer"
                        size="sm"
                        onClick={() => setActiveSection("list")}
                      >
                        <BookText />
                      </Toggle>
                    </SidebarGroup>

                    <SidebarGroup>
                      <Toggle
                        className="bg-black text-white size-8 cursor-pointer"
                        size="sm"
                        onClick={() => setActiveSection("form")}
                      >
                        <FilePlus />
                      </Toggle>
                    </SidebarGroup>
                  </SidebarContent>

                  <SidebarFooter className="text-white"></SidebarFooter>
                </div>
              </aside>

              <div className="flex-1 pl-4">
                {activeSection === "list" && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold mb-2">
                          Lista de registros
                        </h2>
                        <FilterBar onSearch={setSearchTerm} />
                      </div>

                      <TableWithPagination
                        data={filteredData}
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                    </div>
                  </motion.div>
                )}
                {activeSection === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div>
                      <h2 className="text-lg font-semibold mb-2">
                        Novo registro
                      </h2>
                      <FormProvider {...form}>
                        <form
                          onSubmit={form.handleSubmit(createNewItem)}
                          className="space-y-8"
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome do Cliente</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jonh Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end">
                            <Button className="cursor-pointer" type="submit">
                              Criar Novo
                            </Button>
                          </div>
                        </form>
                      </FormProvider>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
