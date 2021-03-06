<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="Vendor")
 */
class Vendor
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * 
     * The primary ID for the vendor
     */
    protected $id;

    /**
     * @ORM\Column(type="string", unique=true)
     *
     * Vendor's company name
     */
    protected $name;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $enabled;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $dateCreated;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $dateModified;

    /**
     * @ORM\Column(type="string")
     */
    protected $userLastModified;

    /**
     * Vendor constructor.
     * @param $name
     * @param $user
     */
    public function __construct($name, $user) {
        $this->name = $name;
        $this->enabled = TRUE;

        // Set the creation and modify date to current date
        $now = new \DateTime("NOW");
        $this->dateCreated = $now;
        $this->dateModified = $now;

        $this->userLastModified = $user;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @param string $user
     *
     * @return Vendor
     */
    public function setName($name, $user)
    {
        $this->name = $name;

        $now = new \DateTime("NOW");
        $this->dateModified = $now;

        $this->userLastModified = $user;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     * @param string $user
     *
     * @return Vendor
     */
    public function setEnabled($enabled, $user)
    {
        $this->enabled = $enabled;

        $now = new \DateTime("NOW");
        $this->dateModified = $now;

        $this->userLastModified = $user;

        return $this;
    }

    /**
     * Get enabled
     *
     * @return boolean
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set dateCreated
     *
     * @param \DateTime $dateCreated
     * @param string $user
     *
     * @return Vendor
     */
    public function setDateCreated($dateCreated, $user)
    {
        $this->dateCreated = $dateCreated;

        $this->userLastModified = $user;
        return $this;
    }

    /**
     * Get dateCreated
     *
     * @return \DateTime
     */
    public function getDateCreated()
    {
        return $this->dateCreated;
    }

    /**
     * Set dateModified
     *
     * @param \DateTime $dateModified
     * @param string $user
     *
     * @return Vendor
     */
    public function setDateModified($dateModified, $user)
    {
        $this->dateModified = $dateModified;

        $this->userLastModified = $user;

        return $this;
    }

    /**
     * Get dateModified
     *
     * @return \DateTime
     */
    public function getDateModified()
    {
        return $this->dateModified;
    }

    /**
     * Set userLastModified
     *
     * @param string $userLastModified
     * @return Vendor
     */
    public function setUserLastModified($userLastModified)
    {
        $this->userLastModified = $userLastModified;

        return $this;
    }

    /**
     * Get userLastModified
     *
     * @return string
     */
    public function getUserLastModified()
    {
        return $this->userLastModified;
    }
}
