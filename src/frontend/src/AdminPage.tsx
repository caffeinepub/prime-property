import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  ArrowLeft,
  Building2,
  ImageIcon,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  Plus,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { loadConfig } from "./config";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAddProperty,
  useGetAllProperties,
  useRemoveProperty,
} from "./hooks/useQueries";
import { StorageClient } from "./utils/StorageClient";

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: properties = [], isLoading: propertiesLoading } =
    useGetAllProperties();
  const addProperty = useAddProperty();
  const removeProperty = useRemoveProperty();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "Sale",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const config = await loadConfig();
    const agent = new HttpAgent({ host: config.backend_host });
    const storageClient = new StorageClient(
      config.bucket_name,
      config.storage_gateway_url,
      config.backend_canister_id,
      config.project_id,
      agent,
    );
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await storageClient.putFile(bytes, (pct) => {
      setUploadProgress(pct);
    });
    const url = await storageClient.getDirectURL(hash);
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.location) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!imageFile) {
      toast.error("Please select an image.");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const imageUrl = await uploadImage(imageFile);
      await addProperty.mutateAsync({
        title: form.title,
        description: form.description,
        price: form.price,
        location: form.location,
        propertyType: form.propertyType,
        imageUrl,
      });
      toast.success("Property added successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        propertyType: "Sale",
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error("Failed to add property. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await removeProperty.mutateAsync(id);
      toast.success("Property removed.");
    } catch {
      toast.error("Failed to remove property.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Toaster richColors />

      {/* Header */}
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                window.location.hash = "";
              }}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              data-ocid="admin.back.link"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </button>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">Admin Panel</span>
            </div>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60 hidden sm:block">
                {identity?.getPrincipal().toString().slice(0, 12)}…
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white text-xs"
                onClick={() => clear()}
                data-ocid="admin.logout.button"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="bg-gold hover:bg-gold/90 text-white text-xs"
              onClick={() => login()}
              disabled={isLoggingIn}
              data-ocid="admin.login.button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <LogIn className="w-3.5 h-3.5 mr-1" />
              )}
              {isLoggingIn ? "Connecting…" : "Login"}
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-gold" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                Admin Access Required
              </h1>
              <p className="text-muted-foreground text-sm max-w-sm mb-8">
                Login with your identity to manage property listings for Prime
                Property.
              </p>
              <Button
                size="lg"
                className="bg-navy hover:bg-navy/90 text-white px-8"
                onClick={() => login()}
                disabled={isLoggingIn}
                data-ocid="admin.login.primary_button"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isLoggingIn ? "Connecting…" : "Login to Admin Panel"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="space-y-10"
            >
              {/* Add Property Form */}
              <section data-ocid="admin.add_property.panel">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Add New Property
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a photo and fill in the property details.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-card p-7 space-y-6"
                >
                  {/* Image Upload */}
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                      Property Image
                    </p>
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: file input trigger */}
                    <div
                      className="relative border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-gold transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      data-ocid="admin.image.dropzone"
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-52 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-semibold flex items-center gap-2">
                              <Upload className="w-4 h-4" /> Change Image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-40 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                          <ImageIcon className="w-10 h-10 text-border" />
                          <span className="text-sm">
                            Click to upload property photo
                          </span>
                          <span className="text-xs text-muted-foreground/60">
                            JPG, PNG, WEBP accepted
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      data-ocid="admin.image.upload_button"
                    />
                  </div>

                  {/* Upload progress */}
                  {isUploading && (
                    <div data-ocid="admin.upload.loading_state">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Uploading image…</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="prop-title"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5 block"
                      >
                        Title
                      </label>
                      <Input
                        id="prop-title"
                        placeholder="e.g. 3BHK Apartment in DC Colony"
                        value={form.title}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, title: e.target.value }))
                        }
                        data-ocid="admin.property.title.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prop-price"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5 block"
                      >
                        Price
                      </label>
                      <Input
                        id="prop-price"
                        placeholder="e.g. ₹45 Lakhs"
                        value={form.price}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, price: e.target.value }))
                        }
                        data-ocid="admin.property.price.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prop-location"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5 block"
                      >
                        Location
                      </label>
                      <Input
                        id="prop-location"
                        placeholder="e.g. Huda Market, Jind"
                        value={form.location}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, location: e.target.value }))
                        }
                        data-ocid="admin.property.location.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="prop-type"
                        className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5 block"
                      >
                        Type
                      </label>
                      <Select
                        value={form.propertyType}
                        onValueChange={(v) =>
                          setForm((p) => ({ ...p, propertyType: v }))
                        }
                      >
                        <SelectTrigger
                          id="prop-type"
                          data-ocid="admin.property.type.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sale">For Sale</SelectItem>
                          <SelectItem value="Rent">For Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="prop-description"
                      className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5 block"
                    >
                      Description
                    </label>
                    <Textarea
                      id="prop-description"
                      placeholder="Describe the property — size, amenities, nearby landmarks…"
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      data-ocid="admin.property.description.textarea"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-navy hover:bg-navy/90 text-white w-full sm:w-auto px-10"
                    disabled={isUploading || addProperty.isPending}
                    data-ocid="admin.property.submit_button"
                  >
                    {isUploading || addProperty.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {isUploading
                      ? "Uploading…"
                      : addProperty.isPending
                        ? "Adding…"
                        : "Add Property"}
                  </Button>
                </form>
              </section>

              {/* Properties List */}
              <section data-ocid="admin.properties.panel">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Manage Properties
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {properties.length}{" "}
                    {properties.length === 1 ? "property" : "properties"} listed
                  </p>
                </div>

                {propertiesLoading ? (
                  <div
                    className="flex justify-center py-16"
                    data-ocid="admin.properties.loading_state"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  </div>
                ) : properties.length === 0 ? (
                  <div
                    className="bg-white rounded-2xl shadow-card p-12 text-center"
                    data-ocid="admin.properties.empty_state"
                  >
                    <Building2 className="w-10 h-10 text-border mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">
                      No properties added yet.
                    </p>
                    <p className="text-muted-foreground/60 text-xs mt-1">
                      Add your first property above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {properties.map((prop, i) => (
                      <motion.div
                        key={prop.id.toString()}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="bg-white rounded-xl shadow-card overflow-hidden"
                        data-ocid={`admin.properties.item.${i + 1}`}
                      >
                        <div className="relative h-44 bg-cream">
                          {prop.imageUrl ? (
                            <img
                              src={prop.imageUrl}
                              alt={prop.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-10 h-10 text-border" />
                            </div>
                          )}
                          <Badge
                            className={`absolute top-3 left-3 text-xs font-semibold ${
                              prop.propertyType === "Sale"
                                ? "bg-navy text-white"
                                : "bg-gold text-white"
                            }`}
                          >
                            {prop.propertyType === "Sale"
                              ? "For Sale"
                              : "For Rent"}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-sm text-foreground leading-tight mb-1 line-clamp-1">
                            {prop.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            {prop.location}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-semibold text-gold mb-3">
                            <Tag className="w-3 h-3" />
                            {prop.price}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full text-xs"
                            onClick={() => handleDelete(prop.id)}
                            disabled={removeProperty.isPending}
                            data-ocid={`admin.properties.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Delete Property
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
