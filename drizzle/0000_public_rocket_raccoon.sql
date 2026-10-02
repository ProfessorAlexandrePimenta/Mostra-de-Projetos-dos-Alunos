CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`authors` text NOT NULL,
	`summary` text NOT NULL,
	`problem` text DEFAULT '' NOT NULL,
	`solution` text DEFAULT '' NOT NULL,
	`tools` text DEFAULT '' NOT NULL,
	`category` text DEFAULT 'Outros' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
