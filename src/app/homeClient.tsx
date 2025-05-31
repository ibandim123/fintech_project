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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookText, FilePlus } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  //Revisar código aqui
  const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
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

  // const { register, setValue, watch } = useForm({
  //   defaultValues: {
  //     status: true,
  //   },
  // });

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetch("http://localhost:3001/clients");
        const response = await data.json();
        console.log(response);

        // setValue("status", response.status);
        setDataRegister(response);
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      }
    }

    getData();
  }, []);

  async function handleDelete(id: number) {
    fetch(`http://localhost:3001/clients/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao deletar");
        return fetch("http://localhost:3001/clients").then((r) => r.json());
      })
      .then(setDataRegister)
      .catch((err) => console.error("Erro:", err));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await fetch("http://localhost:3001/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar dados");
      }
      const data = await response.json();
      console.log(data);
      console.log("Dados enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar dados: ", error);
    }
  }

  async function onEdit(values: any) {
    console.log(values);
  }
  // Terminio da revisão de código
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <section className="flex justify-center py-10">
          <Card
            className="w-[48rem] p-[30px] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
            style={{ borderRadius: "16px" }}
          >
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardAction>Ações</CardAction>
            </CardHeader>

            <CardContent className="flex mt-4 h-[24rem] ">
              <aside className=" bg-black backdrop-blur-md shadow-md rounded-3xl p-8 flex flex-col gap-4 border border-black/30 h-full justify-between">
                <SidebarHeader className="text-white">Header</SidebarHeader>

                <SidebarContent>
                  <SidebarGroup>
                    <Button
                      className="size-8 cursor-pointer"
                      size="icon"
                      onClick={() => setActiveSection("list")}
                    >
                      <BookText />
                    </Button>
                  </SidebarGroup>

                  <SidebarGroup>
                    <Button
                      className="size-8 cursor-pointer"
                      size="icon"
                      onClick={() => setActiveSection("form")}
                    >
                      <FilePlus />
                    </Button>
                  </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="text-white">Rodapé</SidebarFooter>
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
                      <h2 className="text-lg font-semibold mb-2">
                        📋 Lista de registros
                      </h2>
                      <Table>
                        <TableCaption>
                          Lista de clientes cadastrados
                        </TableCaption>

                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ação</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {dataRegister?.map((item: any) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                {item.name}
                              </TableCell>

                              <TableCell>{item.email}</TableCell>

                              <TableCell>
                                {item.status ? "Ativo" : "Inativo"}
                              </TableCell>

                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="text-sm text-blue-500 hover:underline">
                                      Editar
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit profile</DialogTitle>

                                      <FormProvider {...form}>
                                        <form
                                          onSubmit={form.handleSubmit(onEdit)}
                                          className="space-y-8"
                                        >
                                          <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Nome do Cliente
                                                </FormLabel>
                                                <FormControl>
                                                  <Input {...field} />
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
                                                  <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                  <Select
                                                    onValueChange={
                                                      field.onChange
                                                    }
                                                  >
                                                    <SelectTrigger className="w-[180px]">
                                                      <SelectValue placeholder="Status" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                      <SelectItem value="true">
                                                        Ativo
                                                      </SelectItem>

                                                      <SelectItem value="false">
                                                        Inativo
                                                      </SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <div className="flex justify-end">
                                            <Button
                                              className="cursor-pointer"
                                              type="submit"
                                            >
                                              Editar registro
                                            </Button>
                                          </div>
                                        </form>
                                      </FormProvider>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                      <div className="grid gap-3"></div>
                                      <div className="grid gap-3"></div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="ml-2 text-sm text-red-500 hover:underline">
                                      Deletar
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Você tem certeza que deseja apagar esse
                                        registro?
                                      </DialogTitle>
                                      <DialogDescription>
                                        Essa ação não pode ser desfeita. Essa
                                        ação vai deletar o registro
                                        permanentemente de nosso banco de dados.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex justify-end">
                                      <Button
                                        className="ml-2 text-sm text-red-500 hover:underline"
                                        onClick={() => handleDelete(item.id)}
                                      >
                                        Apagar
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                        📄 Novo registro
                      </h2>
                      <FormProvider {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
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
