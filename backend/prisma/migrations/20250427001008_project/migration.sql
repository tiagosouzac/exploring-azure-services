BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'CLIENTE',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[tickets] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [tickets_status_df] DEFAULT 'ABERTO',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [tickets_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [closedAt] DATETIME2,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [tickets_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[messages] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [messages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] NVARCHAR(1000) NOT NULL,
    [ticketId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [messages_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[attachments] (
    [id] NVARCHAR(1000) NOT NULL,
    [filename] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [mimetype] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [attachments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [messageId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [attachments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[tickets] ADD CONSTRAINT [tickets_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[messages] ADD CONSTRAINT [messages_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[messages] ADD CONSTRAINT [messages_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[tickets]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[attachments] ADD CONSTRAINT [attachments_messageId_fkey] FOREIGN KEY ([messageId]) REFERENCES [dbo].[messages]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
