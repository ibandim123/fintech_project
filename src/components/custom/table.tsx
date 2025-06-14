import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Description } from "@radix-ui/react-dialog";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { SearchActiveId } from "@/app/models/home/activesModel";

type Client = {
  id: number;
  name: string | null;
  email: string | null;
  status: boolean | null;
};

type TableWithPaginationProps = {
  data: Client[];
  onDelete: (id: number | null) => Promise<void>;
  onEdit: (values: any) => Promise<void>;
};

type Financial_Asset = {
  message: string;
  code: number;
  data: {
    clientId: number;
    financial_asset: string;
    id: number;
    value: number;
  };
};

export default function TableWithPagination({
  data,
  onDelete,
  onEdit,
}: TableWithPaginationProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [viewItem, setViewItem] = useState<Client | null>(null);
  const [editingItem, setEditingItem] = useState<Client | null>(null);
  const [deletingItem, setDeletingItem] = useState<number | null>(null);

  const [asset, setData] = useState<any>();
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // Rever essa parte do código - Chamada Assíncrona direto no Componente

  // useEffect(() => {
  //   getActiveAssets();
  // }, []);

  const columns: ColumnDef<any>[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (row.original.status ? "Ativo" : "Inativo"),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              onClick={() => {
                setViewItem(row.original);
                getActiveAssets(row.original.id);
              }}
            >
              <Eye />
            </Button>
            <Button
              className="cursor-pointer"
              size="icon"
              onClick={() => setEditingItem(row.original)}
            >
              <Pencil />
            </Button>
            <Button
              className="cursor-pointer"
              size="icon"
              onClick={() => setDeletingItem(row.original.id)}
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize: 4 } },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize: 4 })
          : updater;
      setPageIndex(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  async function getActiveAssets(id: number) {
    const response = await SearchActiveId(id)
      .then((response) => response)
      .catch((error) => error)
      .finally();

    setData(response.data);
  }

  function EditDialog({
    item,
    onClose,
  }: {
    item: Client | null;
    onClose: () => void;
  }) {
    const formEdit = useForm({
      defaultValues: {
        id: item?.id,
        name: item?.name,
        email: item?.email,
        status: item?.status,
      },
    });

    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Editar registro</DialogTitle>
          <FormProvider {...formEdit}>
            <form
              onSubmit={formEdit.handleSubmit((data: any) => {
                // Transforma o valor do status para boolean
                const payload = {
                  ...data,
                  status: data.status === "true" || data.status === true,
                };
                handleEditClick(payload);
                onClose();
              })}
              className="space-y-8"
            >
              <Description></Description>
              <FormField
                control={formEdit.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formEdit.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formEdit.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={(field.value ?? "").toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="true">Ativo</SelectItem>

                          <SelectItem value="false">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button className="cursor-pointer" type="submit">
                  Editar
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    );
  }

  function DeleteDialog({
    item,
    onClose,
  }: {
    item: number | null;
    onClose: () => void;
  }) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Deletar registro</DialogTitle>
          <Description>
            Tem certeza que deseja apagar esse registro da nossa base de dados?,
            a ação é irreversível.
          </Description>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteClick(item || null);
                onClose();
              }}
            >
              Deletar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function ViewDialog({
    item,
    onClose,
  }: {
    item: Client | null;
    onClose: () => void;
  }) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Ativos do Cliente</DialogTitle>
          <Description></Description>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{asset?.data?.financial_asset}</TableCell>
                <TableCell>{asset?.data?.value}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    );
  }

  function handleEditClick(values: any) {
    onEdit(values);
  }

  function handleDeleteClick(id: number | null) {
    onDelete(id);
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          Lista de {data.length}{" "}
          {data.length > 1 ? "clientes cadastrados" : "cliente cadastrado"}
        </TableCaption>
      </Table>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>

      {editingItem && (
        <EditDialog item={editingItem} onClose={() => setEditingItem(null)} />
      )}
      {deletingItem && (
        <DeleteDialog
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
        />
      )}
      {viewItem && (
        <ViewDialog item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </div>
  );
}
