import React, { useState, useEffect } from "react";
import { Form, Checkbox, Toast } from "radix-ui";
import { CheckIcon, TrashIcon, Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import t from "../../i18n";

export interface HeaderRule {
  id: string;
  headerName: string;
  headerValue: string;
  urlPattern: string;
  enabled: boolean;
}

interface IProps {
  onSubmit: (data: HeaderRule[]) => void;
  initialValue?: HeaderRule[] | null;
}

const HeaderTool = ({ onSubmit, initialValue }: IProps) => {
  const [rules, setRules] = useState<HeaderRule[]>(initialValue || []);
  const [editingRule, setEditingRule] = useState<HeaderRule | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (initialValue) {
      setRules(initialValue);
    }
  }, [initialValue]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMessage(msg);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const headerName = (formData.get("headerName") as string)?.trim();
    const headerValue = (formData.get("headerValue") as string)?.trim();
    const urlPattern = (formData.get("urlPattern") as string)?.trim();

    if (!headerName) {
      setMessage(t("header.nameRequired"));
      return;
    }

    if (!headerValue) {
      setMessage(t("header.valueRequired"));
      return;
    }

    let newRules: HeaderRule[];

    if (editingRule) {
      newRules = rules.map((rule) =>
        rule.id === editingRule.id
          ? { ...rule, headerName, headerValue, urlPattern: urlPattern || "" }
          : rule
      );
    } else {
      const newRule: HeaderRule = {
        id: Date.now().toString(),
        headerName,
        headerValue,
        urlPattern: urlPattern || "",
        enabled: true,
      };
      newRules = [...rules, newRule];
    }

    try {
      await onSubmit(newRules);
      setRules(newRules);
      setEditingRule(null);
      setIsAdding(false);
      setMessage("");
      showToast("success", t("common.saveSuccess"));
    } catch (error) {
      showToast("error", t("common.saveFailed"));
    }
  };

  const handleToggleEnabled = async (ruleId: string) => {
    const newRules = rules.map((rule) =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    );

    try {
      await onSubmit(newRules);
      setRules(newRules);
      showToast("success", t("common.statusUpdated"));
    } catch (error) {
      showToast("error", t("common.updateFailed"));
    }
  };

  const handleDelete = async (ruleId: string) => {
    const newRules = rules.filter((rule) => rule.id !== ruleId);

    try {
      await onSubmit(newRules);
      setRules(newRules);
      showToast("success", t("common.deleteSuccess"));
    } catch (error) {
      showToast("error", t("common.deleteFailed"));
    }
  };

  const handleEdit = (rule: HeaderRule) => {
    setEditingRule(rule);
    setIsAdding(true);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setIsAdding(false);
    setMessage("");
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="w-full">
        <div className="mb-3">
          <div className="text-xs font-medium mb-2 text-[#666]">
            {t("header.configuredRules")} ({rules.length})
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {rules.length === 0 ? (
              <div className="text-xs text-[#999] text-center py-4 border border-dashed border-[#ddd] rounded">
                {t("common.noRulesHint")}
              </div>
            ) : (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="mb-2 p-2 border border-[#ddd] rounded bg-white"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1">
                      <Checkbox.Root
                        className="w-4 h-4 flex items-center justify-center border border-[#ddd] rounded bg-white shrink-0"
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleEnabled(rule.id)}
                      >
                        <Checkbox.Indicator>
                          <CheckIcon className="text-[#233895]" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#333] break-all">
                          <span className="font-medium">{rule.headerName}:</span>{" "}
                          {rule.headerValue}
                        </div>
                        {rule.urlPattern && (
                          <div className="text-xs text-[#999] break-all mt-1">
                            <span className="font-medium">{t("common.match")}:</span> {rule.urlPattern}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2 shrink-0">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="p-1 text-[#233895] hover:bg-[#f0f0f0] rounded cursor-pointer"
                        title={t("common.edit")}
                      >
                        <Pencil1Icon />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="p-1 text-[#ff4d4f] hover:bg-[#fff2f0] rounded cursor-pointer"
                        title={t("common.delete")}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1 text-xs p-2 bg-[#233895] text-white border-none rounded cursor-pointer hover:bg-[#1a2b75]"
          >
            <PlusIcon />
            {t("common.addNewRule")}
          </button>
        ) : (
          <Form.Root className="w-full" onSubmit={handleSubmitForm}>
            <div className="text-xs font-medium mb-2 text-[#666]">
              {editingRule ? t("common.editRule") : t("common.addNewRule")}
            </div>

            <Form.Field className="my-2 w-full" name="headerName">
              <Form.Control asChild>
                <input
                  name="headerName"
                  placeholder={t("header.namePlaceholder")}
                  defaultValue={editingRule?.headerName || ""}
                  onChange={() => message && setMessage("")}
                  className="w-full box-border border border-[#ddd] rounded text-xs p-2"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field className="my-2 w-full" name="headerValue">
              <Form.Control asChild>
                <input
                  name="headerValue"
                  placeholder={t("header.valuePlaceholder")}
                  defaultValue={editingRule?.headerValue || ""}
                  onChange={() => message && setMessage("")}
                  className="w-full box-border border border-[#ddd] rounded text-xs p-2"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field className="my-2 w-full" name="urlPattern">
              <Form.Control asChild>
                <input
                  name="urlPattern"
                  placeholder={t("header.urlPatternPlaceholder")}
                  defaultValue={editingRule?.urlPattern || ""}
                  className="w-full box-border border border-[#ddd] rounded text-xs p-2"
                />
              </Form.Control>
            </Form.Field>

            {message && (
              <p className="text-[#ff4d4f] my-2 text-center text-xs">{message}</p>
            )}

            <div className="flex gap-2">
              <Form.Submit asChild>
                <button
                  type="submit"
                  className="flex-1 text-xs p-2 bg-[#233895] text-white border-none rounded cursor-pointer hover:bg-[#1a2b75]"
                >
                  {editingRule ? t("common.saveChanges") : t("common.addRule")}
                </button>
              </Form.Submit>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 text-xs p-2 bg-[#f5f5f5] text-[#666] border border-[#ddd] rounded cursor-pointer hover:bg-[#e8e8e8]"
              >
                {t("common.cancel")}
              </button>
            </div>
          </Form.Root>
        )}
      </div>

      <Toast.Root
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded shadow-md ${
          toastType === "success"
            ? "bg-[#f6ffed] border border-[#b7eb8f]"
            : "bg-[#fff2f0] border border-[#ffccc7]"
        }`}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title
          className={
            toastType === "success" ? "text-[#52c41a]" : "text-[#ff4d4f]"
          }
        >
          {toastMessage}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed inset-0 flex items-center justify-center p-4 m-0 z-50" />
    </Toast.Provider>
  );
};

export default HeaderTool;
