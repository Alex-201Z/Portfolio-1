
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Bot, Loader2, MessageSquare, Send, X } from "lucide-react";
import { submitContactForm } from "@/app/contact/actions";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { ScrollArea } from "./ui/scroll-area";

const chatbotSchema = z.object({
  message: z.string().min(2, { message: "Message is too short." }),
});

type Message = {
    role: 'user' | 'assistant';
    content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatbotSchema>>({
    resolver: zodResolver(chatbotSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function onSubmit(values: z.infer<typeof chatbotSchema>) {
    setMessages(prev => [...prev, { role: 'user', content: values.message }]);
    form.reset();

    startTransition(async () => {
      const result = await submitContactForm({
          name: 'Chatbot User',
          email: 'chatbot@example.com',
          message: values.message
      });
      if (result.success && result.aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: result.aiResponse! }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: result.message || "An error occurred." }]);
      }
    });
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-5 z-50"
          >
            <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Bot className="w-7 h-7 text-primary text-glow"/>
                    <CardTitle className="text-xl font-headline">AI Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5"/>
                </Button>
              </CardHeader>
              <ScrollArea className="flex-grow h-0" ref={messagesContainerRef}>
                <CardContent className="p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isPending && (
                     <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-secondary">
                           <Loader2 className="w-5 h-5 animate-spin text-primary"/>
                        </div>
                    </div>
                  )}
                  {messages.length === 0 && (
                      <div className="text-center text-sm text-muted-foreground pt-12">
                        <Bot className="w-10 h-10 mx-auto mb-3 text-primary/50"/>
                        <p>Posez-moi une question sur le portfolio, les compétences ou l'expérience d'Alex Ondo !</p>
                      </div>
                  )}
                </CardContent>
              </ScrollArea>
              <CardFooter>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full gap-2">
                       <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                <Input placeholder="Écrire un message..." {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      <Button type="submit" size="icon" disabled={isPending}>
                          <Send className="w-5 h-5"/>
                      </Button>
                    </form>
                 </Form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full button-glow shadow-2xl z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      </Button>
    </>
  );
}
